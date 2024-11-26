import express from 'express';
import pool from './db.js'; 
import { verifyToken } from './middleware.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import secrets from './secrets.js';



const router = express.Router();

// Registrierungs-Endpoint
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email und Passwort sind erforderlich!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await pool.query('INSERT INTO user (email, password) VALUES (?, ?)', [email, hashedPassword]);
        const token = jwt.sign({ email }, secrets.jwt_secret_key, { expiresIn: '1h' });
        res.status(201).json({ message: 'Benutzer erfolgreich registriert!', token });
    } catch (error) {
        console.error("Fehler bei der Registrierung:", error.message);
        res.status(500).json({ error: 'Fehler bei der Registrierung' });
    }
});

// Login-Endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email und Passwort sind erforderlich!' });
    }

    try {
        const result = await pool.query('SELECT * FROM user WHERE email = ?', [email]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Benutzer nicht gefunden' });
        }

        const user = result[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Ungültiges Passwort' });
        }

        const token = jwt.sign({ email: user.email }, secrets.jwt_secret_key, { expiresIn: '1h' });
        res.json({ message: 'Erfolgreich eingeloggt', token });
    } catch (error) {
        console.error("Fehler beim Login:", error.message);
        res.status(500).json({ error: 'Fehler beim Login' });
    }
});

// Geschützte Route für das Benutzerprofil
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const result = await pool.query('SELECT * FROM user WHERE email = ?', [userEmail]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Benutzer nicht gefunden' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Fehler beim Abrufen des Profils:', error.message);
        res.status(500).json({ error: 'Fehler beim Abrufen des Profils' });
    }
});

// Shop-Endpoint: Produkte abrufen
router.get('/products', async (req, res) => {
    try {
        const products = await pool.query('SELECT * FROM product');
        res.setHeader('Content-Type', 'application/json'); 
        res.json(products); 
    } catch (error) {
        console.error('Fehler beim Abrufen der Produkte:', error.message);
        res.status(500).json({ error: 'Fehler beim Abrufen der Produkte' });
    }
});

// Bestell-Route: Checkout
router.post('/checkout', async (req, res) => {
    const { orderItems } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'Keine Bestellartikel übermittelt' });
    }

    const orderId = orderItems[0].order_id; // Einheitliche Bestellnummer für alle Artikel
    const userId = orderItems[0].user_id;
    const email = orderItems[0].email;

    // Konvertiert `order_date` ins richtige Format für MySQL
    const orderDate = new Date(orderItems[0].order_date).toISOString().slice(0, 19).replace('T', ' ');

    // Berechnet den Gesamtpreis der Bestellung
    const totalPrice = orderItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        await connection.query(
            'INSERT INTO `order` (order_id, user_id, email, order_date, total_price) VALUES (?, ?, ?, ?, ?)',
            [orderId, userId, email, orderDate, totalPrice]
        );

        const orderItemQueries = orderItems.map(item => {
            return connection.query(
                `INSERT INTO order_item (order_id, user_id, email, order_date, product_id, title, price, quantity, total_price)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    item.order_id,
                    item.user_id,
                    item.email,
                    orderDate, 
                    item.product_id,
                    item.title,
                    item.price,
                    item.quantity,
                    item.total_price,
                ]
            );
        });

        await Promise.all(orderItemQueries);

        // Commit der Transaktion nach erfolgreichem Abschluss aller Queries
        await connection.commit();

        res.status(201).json({
            message: 'Bestellung erfolgreich erstellt',
            orderId,
            totalPrice: totalPrice.toFixed(2),
        });
    } catch (error) {
        // Rollback der Transaktion bei Fehlern, um inkonsistente Zustände zu vermeiden
        await connection.rollback();
        console.error('Fehler beim Speichern der Bestellung:', error);
        res.status(500).json({ message: 'Fehler beim Speichern der Bestellung' });
    } finally {
        connection.release(); // Gib die Datenbankverbindung zurück
    }
});

export default router;
