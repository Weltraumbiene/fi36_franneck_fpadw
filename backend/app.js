// app.js
import express from 'express';
import cors from 'cors'; // Importiere das CORS-Paket
import apiRouter from './routes/api.js'; // Korrekt


const app = express();

app.use(express.json()); // Middleware für JSON Parsing in Anfragen

// CORS konfigurieren
const corsOptions = {
    origin: 'http://localhost:3000', // Nur Anfragen vom React-Frontend zulassen
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions)); // CORS global anwenden

// Haupt-Route für die Basis-URL
app.get('/', (req, res) => {
    res.send('Willkommen auf der Hauptseite!');
});

// API-Router einbinden
app.use('/api', apiRouter);

// Server starten
app.listen(4000, '0.0.0.0', () => {
    console.log('Server läuft auf http://bcf.mshome.net:4000');
});
