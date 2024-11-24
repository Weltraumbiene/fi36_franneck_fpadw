// middleware.js
import jwt from 'jsonwebtoken';
import secrets from './secrets.js'; // Geheimschlüssel für JWT

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Token aus den Headers holen

    if (!token) {
        return res.status(403).json({ message: 'Kein Token bereitgestellt' });
    }

    try {
        const decoded = jwt.verify(token, secrets.jwt_secret); // JWT verifizieren (mit geheimem Schlüssel aus secrets.js)
        req.user = decoded; // Benutzerdaten aus dem Token in req.user speichern
        next(); // Weiter zur nächsten Middleware oder Route
    } catch (error) {
        return res.status(401).json({ message: 'Ungültiges oder abgelaufenes Token' });
    }
};
