import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js'; // Andere API-Routen
import contactAPIRouter from './routes/ContactAPI.js'; // Neue Kontakt-API-Routen

const app = express();

app.use(express.json()); // Middleware für JSON Parsing in Anfragen

import dotenv from 'dotenv';
dotenv.config(); // Lädt die .env-Datei

// CORS konfigurieren
const corsOptions = {
    origin: ['http://localhost:3000', 'http://bcf.mshome.net:3000'], // Beide URLs erlauben
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions)); // Diese Zeile sorgt dafür, dass CORS auf alle Routen angewendet wird

// Haupt-Route für die Basis-URL
app.get('/', (req, res) => {
  res.send('Willkommen auf der Hauptseite!');
});

// API-Router einbinden
app.use('/api', apiRouter);
app.use('/contact', contactAPIRouter); // Kontakt-API hinzufügen

// Server starten
app.listen(4000, '0.0.0.0', () => {
  console.log('Server läuft auf http://bcf.mshome.net:4000');
});
