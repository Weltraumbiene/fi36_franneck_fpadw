// secrets.js
const JWT_SECRET = process.env.JWT_SECRET_KEY; // Direkt als Konstante

const secrets = {
    db_server: 'localhost',
    db_port: 3306,  // Optional: Standardport für MariaDB/MySQL
    db_username: 'ben',
    db_password: 'passwort',
    db_database: 'fi36_franneck_fpadw',

    jwt_secret_key: JWT_SECRET,  // JWT Secret aus der Umgebungsvariable

    jwt_options: {
        expiresIn: '1h',  // Token läuft nach 1 Stunde ab
        algorithm: 'HS256', // Standardalgorithmus
    }
};

export default secrets;
