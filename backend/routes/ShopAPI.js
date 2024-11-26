import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mariadb from 'mariadb';
import secrets from './secrets.js';  
import { body, validationResult } from 'express-validator';  

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
        res.json(products); 
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

// Bestellvorgang verarbeiten
router.post('/api/order', async (req, res) => {
    const { userId, email, orderItems } = req.body;

    // Eingabewerte validieren
    if (!userId || !email || !orderItems || orderItems.length === 0) {
        return res.status(400).json({ error: 'Fehlende Bestellinformationen' });
    }

    try {
        const connection = await pool.getConnection();

        // Bestellung speichern
        const orderResult = await connection.query(
            'INSERT INTO `order` (user_id, email) VALUES (?, ?)', 
            [userId, email]
        );
        const orderId = orderResult.insertId;

        // Bestellpositionen speichern
        for (let item of orderItems) {
            await connection.query(
                'INSERT INTO `order_item` (order_id, user_id, email, product_id, quantity) VALUES (?, ?, ?, ?, ?)', 
                [orderId, userId, email, item.productId, item.quantity]
            );
        }

        // Leere den Warenkorb nach der Bestellung (optional, wenn du eine Session verwendest)
        req.session.cart = [];

        connection.release();

        res.status(200).json({ message: 'Bestellung erfolgreich' });
    } catch (error) {
        console.error('Fehler bei der Bestellung:', error);
        res.status(500).json({ error: 'Fehler bei der Bestellung' });
    }
});

export default router;