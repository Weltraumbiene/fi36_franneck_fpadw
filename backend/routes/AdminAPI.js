import express from 'express';
import pool from './db.js'; // Pool aus separater Datei (MariaDB-Instanz)
import { body, validationResult } from 'express-validator'; // Eingabevalidierung
import { verifyToken } from './middleware.js'; // Token-Verifizierung
import secrets from './secrets.js'; // Geheimschlüssel

const router = express.Router();

// Middleware zur Admin-Überprüfung
const isAdmin = (req, res, next) => {
    const userEmail = req.headers['email'];
    if (userEmail === 'admin@at24intern.de') {
        next();
    } else {
        res.status(403).json({ error: 'Zugriff verweigert. Adminrechte erforderlich.' });
    }
};

// Produkt erstellen
router.post(
    '/products',
    isAdmin,
    [
        body('title').notEmpty().withMessage('Titel ist erforderlich'),
        body('price').isNumeric().withMessage('Preis muss eine Zahl sein'),
        body('quantity').isInt().withMessage('Menge muss eine ganze Zahl sein'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, price, image, quantity } = req.body;
        try {
            const result = await pool.query(
                `INSERT INTO product (title, description, price, image, quantity) VALUES (?, ?, ?, ?, ?)`,
                [title, description, price, image, quantity]
            );
            res.status(201).json({ success: true, message: 'Produkt erfolgreich erstellt.', productId: result.insertId });
        } catch (error) {
            console.error('Fehler beim Erstellen des Produkts:', error.message);
            res.status(500).json({ error: 'Fehler beim Erstellen des Produkts.' });
        }
    }
);

// Produkt aktualisieren
router.put('/products/:id', isAdmin, async (req, res) => {
    const productId = req.params.id;
    const { title, description, price, image, quantity } = req.body;

    try {
        await pool.query(
            `UPDATE product SET title = ?, description = ?, price = ?, image = ?, quantity = ? WHERE product_id = ?`,
            [title, description, price, image, quantity, productId]
        );
        res.json({ success: true, message: 'Produkt erfolgreich aktualisiert.' });
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Produkts:', error.message);
        res.status(500).json({ error: 'Fehler beim Aktualisieren des Produkts.' });
    }
});

// Produkt löschen
router.delete('/products/:id', isAdmin, async (req, res) => {
    const productId = req.params.id;

    try {
        await pool.query(`DELETE FROM product WHERE product_id = ?`, [productId]);
        res.json({ success: true, message: 'Produkt erfolgreich gelöscht.' });
    } catch (error) {
        console.error('Fehler beim Löschen des Produkts:', error.message);
        res.status(500).json({ error: 'Fehler beim Löschen des Produkts.' });
    }
});

// Nachrichten abrufen
router.get('/messages', isAdmin, async (req, res) => {
    try {
        const results = await pool.query(`SELECT * FROM contact`);
        res.json(results);
    } catch (error) {
        console.error('Fehler beim Abrufen der Nachrichten:', error.message);
        res.status(500).json({ error: 'Fehler beim Abrufen der Nachrichten.' });
    }
});

// Bestellungen abrufen
router.get('/orders', isAdmin, async (req, res) => {
    try {
        const results = await pool.query(`
            SELECT o.order_id, o.email, o.order_date, o.total_price, 
                   GROUP_CONCAT(oi.title SEPARATOR ', ') AS products 
            FROM \`order\` o
            JOIN order_item oi ON o.order_id = oi.order_id
            GROUP BY o.order_id
        `);
        res.json(results);
    } catch (error) {
        console.error('Fehler beim Abrufen der Bestellungen:', error.message);
        res.status(500).json({ error: 'Fehler beim Abrufen der Bestellungen.' });
    }
});

// Benutzer löschen
router.delete('/users/:email', isAdmin, async (req, res) => {
    const userEmail = req.params.email;

    // Überprüfen, ob der Admin versucht, sich selbst zu löschen
    if (userEmail === 'admin@at24intern.de') {
        return res.status(400).json({ error: 'Das Löschen des Admins ist nicht erlaubt.' });
    }

    try {
        const result = await pool.query(`DELETE FROM user WHERE email = ?`, [userEmail]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Benutzer nicht gefunden.' });
        }
        res.json({ success: true, message: `Benutzer mit der E-Mail ${userEmail} erfolgreich gelöscht.` });
    } catch (error) {
        console.error('Fehler beim Löschen des Benutzers:', error.message);
        res.status(500).json({ error: 'Fehler beim Löschen des Benutzers.' });
    }
});

export default router;
