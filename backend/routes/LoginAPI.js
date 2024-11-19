import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mariadb from 'mariadb';
import secrets from './secrets.js';  // Geheimschlüssel und DB-Daten
import { body, validationResult } from 'express-validator';  // Für die Eingabevalidierung

const router = express.Router();

// Datenbankverbindung mit MariaDB
const pool = mariadb.createPool({
  host: secrets.db_server,
  user: secrets.db_username,
  password: secrets.db_password,
  database: secrets.db_database,
  connectionLimit: 5
});

// JWT Secret Key
const JWT_SECRET = secrets.jwt_secret_key;

// Login-Route
router.post(
  '/',
  [
    // Validierung der Eingabewerte
    body('email').isEmail().withMessage('Bitte eine gültige E-Mail-Adresse eingeben'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Das Passwort muss mindestens 8 Zeichen enthalten')
      .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@$%?])/)
      .withMessage('Das Passwort muss einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    let connection;
    try {
      // Überprüfen, ob die E-Mail zur Firmen-Domain gehört
      if (!email.endsWith('@at24intern.de')) {
        return res.status(400).json({ message: 'Nur firmeneigene E-Mail-Adressen sind erlaubt.' });
      }

      // Verbindung zur DB herstellen und den Benutzer abfragen
      connection = await pool.getConnection();

      const result = await connection.query('SELECT * FROM user WHERE email = ?', [email]);

      if (result.length === 0) {
        return res.status(400).json({ message: 'Benutzername oder Passwort ist falsch.' });
      }

      const user = result[0];

      // Passwort mit bcrypt vergleichen
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Benutzername oder Passwort ist falsch.' });
      }

      // JWT-Token erstellen
      const token = jwt.sign(
        { userId: user.user_id, email: user.email },
        JWT_SECRET,
        { expiresIn: secrets.jwt_options.expiresIn }  // Token läuft nach 1 Stunde ab
      );

      // Erfolgreiche Antwort mit Token und userId
      res.status(200).json({ message: 'Erfolgreich eingeloggt.', token, userId: user.user_id });
    } catch (error) {
      console.error('Datenbankfehler:', error);
      res.status(500).json({ message: 'Ein Fehler ist aufgetreten.' });
    } finally {
      if (connection) connection.release();
    }
  }
);

export default router;