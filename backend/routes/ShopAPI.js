// ShopAPI.js Backend

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

router.get('/api/products', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const products = await connection.query('SELECT * FROM product');
      connection.release();
  
      res.setHeader('Content-Type', 'application/json'); // Setzt den Content-Type-Header
      res.json(products); // Gibt die Produkte als JSON zurück
    } catch (error) {
      console.error('Fehler beim Abrufen der Produkte:', error);
  
      res.status(500).json({ error: 'Fehler beim Abrufen der Produkte' }); // Setzt ebenfalls JSON im Fehlerfall
    }
  });
  
  