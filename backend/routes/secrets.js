// /srv/www/fi36_franneck_fpadw/backend/routes/secrets.js
const secrets = {
    db_server: 'localhost',
    db_port: 3306,  // Optional: Standardport für MariaDB/MySQL
    db_username: 'ben',
    db_password: 'passwort',
    db_database: 'fi36_franneck_fpadw',
    jwt_secret_key: 'geheimes_jwt_token_oder_schluessel',
    
    // Optional: Standardwerte für JWT-Token
    jwt_options: {
        expiresIn: '1h',  // Token läuft nach 1 Stunde ab
        algorithm: 'HS256', // Standardalgorithmus
    }
};

export default secrets;
