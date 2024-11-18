// db.js
import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config(); // Umgebungsvariablen laden

const pool = mariadb.createPool({
  host: process.env.DB_SERVER,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 5,
});

export default pool;  // Standard-Export des Pools
