import React, { useEffect, useState } from 'react';
import '../css/Shop.css';

const Shop = ({ isLoggedIn, setIsLoggedIn, setCurrentPage }) => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [modalProduct, setModalProduct] = useState(null); // Produkt für Modal
    const [cart, setCart] = useState([]); // Warenkorb für Session
    const [showCartModal, setShowCartModal] = useState(false); // Warenkorb Modal Sichtbarkeit

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

    // Funktion zum Öffnen des Modals
    const openModal = (product) => {
        setModalProduct(product);
    };

    // Funktion zum Schließen des Modals
    const closeModal = () => {
        setModalProduct(null);
    };

    // Funktion zum Hinzufügen eines Produkts zum Warenkorb
    const addToCart = () => {
        if (modalProduct) {
            setCart([...cart, modalProduct]);
            closeModal(); // Schließe das Modal nach dem Hinzufügen
        }
    };

    // Funktion zum Öffnen des Warenkorb-Modals
    const openCartModal = () => {
        setShowCartModal(true);
    };

    // Funktion zum Schließen des Warenkorb-Modals
    const closeCartModal = () => {
        setShowCartModal(false);
    };

    return (
        <div className="shop-container">
            {isLoggedIn ? (
                <>
                    <h1>Willkommen im Shop!</h1>

                    {/* Buttons nebeneinander */}
                    <div className="button-container">
                        <button className="logout-button" onClick={handleLogout}>
                            Abmelden
                        </button>
                        <button className="cart-button" onClick={openCartModal}>
                            Warenkorb ({cart.length})
                        </button>
                    </div>

                    <div className="product-grid">
                        {products.map((product) => (
                            <div
                                className="product-card"
                                key={product.product_id}
                                onClick={() => openModal(product)}
                            >
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="product-image"
                                />
                                <h2 className="product-title">{product.title}</h2>
                                <p className="product-price">
                                    Preis: {parseFloat(product.price).toFixed(2)} €
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Produkt Modal */}
                    {modalProduct && (
                        <div className={`modal-overlay ${modalProduct ? 'show' : ''}`}>
                            <div className="modal-content">
                                <button className="modal-close" onClick={closeModal}>
                                    ×
                                </button>
                                <img
                                    src={modalProduct.image}
                                    alt={modalProduct.title}
                                    className="product-image"
                                    style={{ width: '300px', height: '300px' }}
                                />
                                <h2>{modalProduct.title}</h2>
                                <p>{modalProduct.description}</p>
                                <p className="product-price">
                                    Preis: {parseFloat(modalProduct.price).toFixed(2)} €
                                </p>
                                <p>Verfügbar: {modalProduct.quantity} Stück</p>
                                <button className="shop-button" onClick={addToCart}>
                                    In den Warenkorb
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Warenkorb-Modal */}
                    {showCartModal && (
                        <div className="cart-modal-overlay show">
                            <div className="cart-modal-content">
                                <button className="cart-modal-close" onClick={closeCartModal}>
                                    ×
                                </button>
                                <h2>Warenkorb</h2>
                                {cart.length === 0 ? (
                                    <p>Der Warenkorb ist leer.</p>
                                ) : (
                                    <ul>
                                        {cart.map((item, index) => (
                                            <li key={index}>
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="product-image"
                                                    style={{ width: '50px', height: '50px' }}
                                                />
                                                <span>{item.title}</span>
                                                <span> x {item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <button className="close-cart-button" onClick={closeCartModal}>
                                    Schließen
                                </button>
                            </div>
                        </div>
                    )}
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
