import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mariadb from 'mariadb';
import secrets from './secrets.js';  // Geheimschlüssel und DB-Daten
import { body, validationResult } from 'express-validator';  // Für die Eingabevalidierung
import axios from 'axios'; // Axios für die HTTP-Anfragen

const router = express.Router();

// Datenbankverbindung mit MariaDB
const pool = mariadb.createPool({
  host: secrets.db_server,
  user: secrets.db_username,
  password: secrets.db_password,
  database: secrets.db_database,
  connectionLimit: 5
});

// Abrufen der Produkte
router.get('/api/products', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const products = await connection.query('SELECT * FROM product');
        connection.release();
  
        res.setHeader('Content-Type', 'application/json');
        res.json(products); // Gibt die Produkte als JSON zurück
    } catch (error) {
        console.error('Fehler beim Abrufen der Produkte:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Produkte' });
    }
});

// Warenkorb in der Session speichern (wenn der Benutzer eingeloggt ist)
router.post('/api/cart', (req, res) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }

    const { productId, quantity } = req.body;

    // Produkt zum Warenkorb hinzufügen
    req.session.cart.push({ productId, quantity });

    res.status(200).json({ message: 'Produkt zum Warenkorb hinzugefügt' });
});

// Bestellübersicht nach Abschluss
router.post('/api/order', async (req, res) => {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.status(400).json({ error: 'Warenkorb ist leer' });
    }

    const { userId } = req.body;
    try {
        const connection = await pool.getConnection();
        const orderResult = await connection.query('INSERT INTO `order` (user_id) VALUES (?)', [userId]);
        const orderId = orderResult.insertId;

        // Bestellpositionen speichern
        for (let item of req.session.cart) {
            await connection.query('INSERT INTO `order_item` (order_id, product_id, quantity) VALUES (?, ?, ?)', 
                                    [orderId, item.productId, item.quantity]);
        }

        // Bestellung an externe API weiterleiten
        const orderDetails = {
            userId,
            items: req.session.cart,
            totalAmount: req.session.cart.reduce((total, item) => total + (item.quantity * item.price), 0) // Hier geht man davon aus, dass der Preis auch im Warenkorb vorhanden ist
        };

        try {
            const response = await axios.post('https://externe-bestell-api.com/order', orderDetails);
            console.log('Bestellung an externe API gesendet', response.data);

            // Leere den Warenkorb
            req.session.cart = [];

            connection.release();

            res.status(200).json({ message: 'Bestellung erfolgreich und an externe API weitergeleitet' });
        } catch (apiError) {
            console.error('Fehler beim Weiterleiten der Bestellung an die externe API:', apiError);
            res.status(500).json({ error: 'Fehler beim Weiterleiten der Bestellung an die externe API' });
        }
    } catch (error) {
        console.error('Fehler bei der Bestellung:', error);
        res.status(500).json({ error: 'Fehler bei der Bestellung' });
    }
});

export default router;
