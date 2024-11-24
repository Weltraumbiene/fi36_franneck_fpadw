import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import der Routen
import apiRouter from './routes/api.js'; 
import contactAPIRouter from './routes/ContactAPI.js'; 
import loginRouter from './routes/LoginAPI.js'; 

// Umgebungsvariablen laden
dotenv.config();

// Initialisierung der Express-App
const app = express();

// CORS-Konfiguration
const corsOptions = {
  origin: ['http://bcf.mshome.net:3000'],  // Erlaubt nur Anfragen von dieser Quelle
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,  // Wenn du mit Cookies arbeitest, solltest du auch `credentials: true` setzen
};

app.use(cors(corsOptions));  // CORS für alle Routen aktivieren

app.use(express.json());  // Middleware für JSON Parsing in Anfragen

// API-Routen definieren
app.use('/api/login', loginRouter); // Login-API Route
app.use('/api', apiRouter);         // Allgemeine API Route (z.B. Produkt-Routen)
app.use('/contact', contactAPIRouter); // Kontakt API Route

// Start des Servers
const PORT = process.env.PORT || 4000;  // Port aus Umgebungsvariablen, ansonsten 4000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server läuft auf http://bcf.mshome.net:${PORT}`);
});
