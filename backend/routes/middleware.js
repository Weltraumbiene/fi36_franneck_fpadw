// middleware.js
import jwt from 'jsonwebtoken';
import secrets from './secrets.js';

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Token aus den Headers holen

    if (!token) {
        return res.status(403).json({ message: 'Kein Token bereitgestellt' });
    }

    try {
        const decoded = jwt.verify(token, secrets.jwt_secret_key); 
        req.user = decoded; // Benutzerdaten an die Anfrage anhängen
        next(); 
    } catch (error) {
        return res.status(401).json({ message: 'Ungültiges oder abgelaufenes Token' });
    }
};