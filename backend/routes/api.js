import express from 'express';
import pool from './db.js'; // Verwende deinen DB-Pool
import { verifyToken } from './middleware.js'; // Token Verifizierung

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

// Bestell-Route: Checkout
router.post('/checkout', async (req, res) => {
    const { orderItems } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'Keine Bestellartikel übermittelt' });
    }

    try {
        const connection = await pool.getConnection(); // Hole eine Verbindung aus dem Pool
        const queries = orderItems.map(item => {
            return connection.execute(
                `INSERT INTO order_item (user_id, email, product_id, title, price, quantity, total_price)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [item.user_id, item.email, item.product_id, item.title, item.price, item.quantity, item.total_price]
            );
        });

        await Promise.all(queries); // Führe alle Abfragen parallel aus
        res.status(200).json({ message: 'Bestellung erfolgreich gespeichert' });

        connection.release(); // Gebe die Verbindung wieder frei
    } catch (error) {
        console.error('Fehler bei der Bestellung:', error);
        res.status(500).json({ message: 'Fehler beim Speichern der Bestellung' });
    }
});

export default router;
