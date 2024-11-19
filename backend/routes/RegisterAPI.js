import express from 'express';
import mariadb from 'mariadb';
import bcrypt from 'bcryptjs';
import secrets from './secrets.js';
import cors from 'cors';

const router = express.Router();

// MariaDB-Verbindungspool
const pool = mariadb.createPool({
  host: secrets.db_server,
  user: secrets.db_username,
  password: secrets.db_password,
  database: secrets.db_database,
  connectionLimit: 5
});

// CORS aktivieren
router.use(cors());

// Registrierung-Route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // E-Mail und Passwort validieren
  if (!email || !password) {
    return res.status(400).json({ message: 'E-Mail und Passwort sind erforderlich.' });
  }

  // E-Mail-Domain validieren (z. B. nur firmeninterne E-Mails zulassen)
  if (!email.endsWith('@at24intern.de')) {
    return res.status(400).json({ message: 'Nur firmeneigene E-Mail-Adressen sind erlaubt.' });
  }

  // Passwort-Validierung (mit regulärem Ausdruck)
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Das Passwort muss mindestens 8 Zeichen lang sein, einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten.',
    });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Prüfen, ob der Benutzer bereits existiert
    const existingUser = await connection.query('SELECT * FROM user WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Benutzer existiert bereits.' });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Benutzer in der Datenbank speichern
    const result = await connection.query('INSERT INTO user (email, password) VALUES (?, ?)', [email, hashedPassword]);

    // Erfolgreiche Antwort
    res.status(201).json({ message: 'Benutzer erfolgreich registriert!', id: result.insertId });
  } catch (error) {
    console.error('Fehler bei der Registrierung:', error);
    res.status(500).json({ message: 'Fehler bei der Registrierung. Bitte versuche es später erneut.' });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
