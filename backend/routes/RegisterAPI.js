import express from 'express';
import bcrypt from 'bcrypt';
import mariadb from 'mariadb';
import secrets from './secrets.js';  // Enthält deine DB- und JWT-Settings

const router = express.Router();
const pool = mariadb.createPool({
  host: secrets.db_server,
  user: secrets.db_username,
  password: secrets.db_password,
  database: secrets.db_database,
  connectionLimit: 5
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Validierung der Eingabedaten
  if (!email || !password) {
    return res.status(400).json({ message: 'E-Mail und Passwort sind erforderlich.' });
  }

  if (!email.endsWith('@at24intern.de')) {
    return res.status(400).json({ message: 'Nur firmeneigene E-Mail-Adressen sind erlaubt.' });
  }

  // Prüfe, ob der Benutzer schon existiert
  let connection;
  try {
    connection = await pool.getConnection();

    const existingUser = await connection.query('SELECT * FROM user WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Benutzer existiert bereits.' });
    }

    // Passwort verschlüsseln mit bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Benutzer in der Datenbank anlegen
    const result = await connection.query('INSERT INTO user (email, password) VALUES (?, ?)', [email, hashedPassword]);

    res.status(201).json({ message: 'Benutzer erfolgreich registriert.', userId: result.insertId });
  } catch (error) {
    console.error('Fehler bei der Registrierung:', error);
    res.status(500).json({ message: 'Fehler bei der Registrierung. Bitte versuche es später erneut.' });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
