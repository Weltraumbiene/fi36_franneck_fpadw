import express from 'express';
import mariadb from 'mariadb';
import secrets from './secrets.js';

const router = express.Router();

const pool = mariadb.createPool({
  host: secrets.db_server,
  user: secrets.db_username,
  password: secrets.db_password,
  database: secrets.db_database,
  connectionLimit: 5
});

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, E-Mail und Nachricht sind erforderlich!' });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const result = await connection.query(
      'INSERT INTO contact (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );

    res.status(200).json({ message: 'Nachricht erfolgreich gespeichert!', id: Number(result.insertId) });
  } catch (error) {
    console.error('Datenbankfehler:', error);
    res.status(500).json({ error: `Fehler beim Speichern der Nachricht: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
