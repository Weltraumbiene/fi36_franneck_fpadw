import React, { useEffect, useState } from 'react';
import '../css/Shop.css';

const Shop = ({ isLoggedIn, setIsLoggedIn, setCurrentPage }) => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    // Überprüfe, ob der Benutzer eingeloggt ist (Token im sessionStorage)
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            setIsLoggedIn(false);  // Setze den Login-Status auf false, wenn kein Token gefunden wird
        } else {
            setIsLoggedIn(true); // Falls Token vorhanden ist, setze den Login-Status auf true
        }
    }, [setIsLoggedIn]);

    // Produkte abrufen, wenn der Benutzer eingeloggt ist
    useEffect(() => {
        const fetchProducts = async () => {
            if (!isLoggedIn) return;  // Verhindert das Abrufen von Produkten, wenn der Benutzer nicht eingeloggt ist

            try {
                const response = await fetch('http://bcf.mshome.net:4000/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Produkte:', error);
                setError('Fehler beim Abrufen der Produkte');
            }
        };

        fetchProducts();
    }, [isLoggedIn]);

    // Abmeldefunktion
    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        setIsLoggedIn(false);  // Setzt den Login-Status auf false
    };

    // Funktion für das Weiterleiten zur Login-Seite
    const redirectToLogin = () => {
        setCurrentPage('login');  // Ändere die aktuelle Seite auf 'login'
    };

    // Wenn es einen Fehler beim Abrufen der Produkte gibt
    if (error) {
        return <div>{error}</div>;
    }

    // Wenn Produkte noch nicht geladen sind
    if (products.length === 0 && isLoggedIn) {
        return <div>Produkte werden geladen...</div>;
    }

    return (
        <div className="shop-container">
            {isLoggedIn ? (
                <>
                    <h1>Willkommen im Shop!</h1>
                    <button className="logout-button" onClick={handleLogout}>
                        Abmelden
                    </button>
                    <div className="product-grid">
                        {products.map((product) => (
                            <div className="product-card" key={product.product_id}>
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="product-image"
                                />
                                <h2 className="product-title">{product.title}</h2>
                                <p>{product.description}</p>
                                <p className="product-price">
                                    Preis: {parseFloat(product.price).toFixed(2)} €
                                </p>
                                <p>Verfügbar: {product.quantity} Stück</p>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div>
                    <p className="login-prompt">Bitte loggen Sie sich ein, um auf den Shop zuzugreifen.</p>
                    <button className="login-button" onClick={redirectToLogin}>
                        Zur Anmeldung
                    </button>
                </div>
            )}
        </div>
    );
};

export default Shop;
