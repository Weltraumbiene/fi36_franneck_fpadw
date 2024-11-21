import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db.js'; // Datenbankverbindung
import secrets from './secrets.js'; // Secrets
import { verifyToken } from './middleware.js';

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
        res.setHeader('Content-Type', 'application/json'); // JSON-Header setzen
        res.json(products); // Produktdaten als JSON zurückgeben
    } catch (error) {
        console.error('Fehler beim Abrufen der Produkte:', error.message);
        res.status(500).json({ error: 'Fehler beim Abrufen der Produkte' });
    }
});

export default router;
