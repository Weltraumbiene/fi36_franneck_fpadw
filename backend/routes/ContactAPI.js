// /srv/www/fi36_franneck_fpadw/backend/routes/ContactAPI.js
import express from 'express';
import mariadb from 'mariadb';
import secrets from './secrets.js';

const router = express.Router();

// MariaDB-Verbindungsdaten
const pool = mariadb.createPool({
  host: secrets.db_server,
  user: secrets.db_username,
  password: secrets.db_password,
  database: secrets.db_database,
  connectionLimit: 5
});

// POST-Route, um Benutzerdaten zu speichern
router.post('/', async (req, res) => {
    const { name, message } = req.body;
  
    // Überprüfe, ob die erforderlichen Felder vorhanden sind
    if (!name || !message) {
      return res.status(400).json({ error: 'Name und Nachricht sind erforderlich!' });
    }
  
    let connection;
    try {
      connection = await pool.getConnection();
  
      // SQL-Statement zum Einfügen der Nachricht
      const result = await connection.query(
        'INSERT INTO contact (name, message) VALUES (?, ?)',
        [name, message]
      );
  
      // Erfolgreiche Antwort zurückgeben, aber insertId in eine normale Zahl umwandeln
      res.status(200).json({ message: 'Nachricht erfolgreich gespeichert!', id: Number(result.insertId) });
    } catch (error) {
      console.error('Datenbankfehler:', error); // Logge den Fehler detaillierter
      res.status(500).json({ error: `Fehler beim Speichern der Nachricht: ${error.message}` });
    } finally {
      if (connection) connection.release(); // Verbindung freigeben
    }
  });
  
  

export default router;
