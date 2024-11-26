import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js'; 
import contactAPIRouter from './routes/ContactAPI.js'; 
import loginRouter from './routes/LoginAPI.js'; 
import adminRouter from './routes/AdminAPI.js';
import jwt from 'jsonwebtoken';

const app = express();

// CORS konfigurieren
const corsOptions = {
  origin: ['http://bcf.mshome.net:3000'],  // Erlaubt nur Anfragen von dieser Quelle
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions)); // CORS für alle Routen aktivieren

app.use(express.json()); // Middleware für JSON Parsing in Anfragen

import dotenv from 'dotenv';
dotenv.config(); // Lädt die .env-Datei

// API-Routen
app.use('/api/login', loginRouter);
app.use('/api', apiRouter);
app.use('/contact', contactAPIRouter);
app.use('/admin', adminRouter);

// Start des Servers
app.listen(4000, '0.0.0.0', () => {
  console.log('Server läuft auf http://bcf.mshome.net:4000');
});