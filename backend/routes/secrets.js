// secrets.js
const JWT_SECRET = process.env.JWT_SECRET_KEY; 

const secrets = {
    db_server: 'localhost',
    db_port: 3306,  
    db_username: 'ben',
    db_password: 'passwort',
    db_database: 'fi36_franneck_fpadw',

    jwt_secret_key: JWT_SECRET,  

    jwt_options: {
        expiresIn: '1h',  
        algorithm: 'HS256', 
    }
};

export default secrets;