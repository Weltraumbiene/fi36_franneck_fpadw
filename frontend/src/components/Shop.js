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
            setIsLoggedIn(false); // Setze den Login-Status auf false, wenn kein Token gefunden wird
        } else {
            setIsLoggedIn(true); // Falls Token vorhanden ist, setze den Login-Status auf true
        }
    }, [setIsLoggedIn]);

    // Produkte abrufen, wenn der Benutzer eingeloggt ist
    useEffect(() => {
        const fetchProducts = async () => {
            if (!isLoggedIn) return; // Verhindert das Abrufen von Produkten, wenn der Benutzer nicht eingeloggt ist

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
        setIsLoggedIn(false); // Setzt den Login-Status auf false
    };

    // Funktion für das Weiterleiten zur Login-Seite
    const redirectToLogin = () => {
        setCurrentPage('login'); // Ändere die aktuelle Seite auf 'login'
    };

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
        if (modalProduct && modalProduct.quantity > 0) {
            const updatedCart = [...cart];
            const productIndex = updatedCart.findIndex(item => item.product_id === modalProduct.product_id);

            if (productIndex !== -1) {
                updatedCart[productIndex].quantity += 1;
            } else {
                updatedCart.push({ ...modalProduct, quantity: 1 });
            }

            setCart(updatedCart);

            const updatedProduct = { ...modalProduct, quantity: modalProduct.quantity - 1 };
            setModalProduct(updatedProduct);
            closeModal();
        }
    };

    // Funktion zum Entfernen eines Artikels aus dem Warenkorb
    const removeFromCart = (productId) => {
        const updatedCart = cart.filter(item => item.product_id !== productId);
        setCart(updatedCart);
    };

    // Funktion zur Anpassung der Menge im Warenkorb
    const updateCartQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        const updatedCart = cart.map(item => {
            if (item.product_id === productId) {
                const maxQuantity = products.find(p => p.product_id === productId)?.quantity || 0;
                return { ...item, quantity: Math.min(newQuantity, maxQuantity) };
            }
            return item;
        });
        setCart(updatedCart);
    };

    // Funktion zum Öffnen des Warenkorb-Modals
    const openCartModal = () => {
        setShowCartModal(true);
    };

    // Funktion zum Schließen des Warenkorb-Modals
    const closeCartModal = () => {
        setShowCartModal(false);
    };

    // Funktion zur Berechnung des Gesamtpreises
    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <div className="shop-container">
            {isLoggedIn ? (
                <>
                    <h1>Willkommen im Shop!</h1>

                    <div className="button-container">
                        <button className="cart-button" onClick={openCartModal}>
                            Warenkorb ({cart.length})
                        </button>
                        <button className="checkout-button">
                            Zur Kasse
                        </button>
                        <button className="logout-button" onClick={handleLogout}>
                            Abmelden
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
                                    <>
                                        <ul className="cart-list">
                                            {cart.map((item, index) => (
                                                <li key={index} className="cart-item">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="cart-item-image"
                                                    />
                                                    <span className="cart-item-title">{item.title}</span>
                                                    <div className="cart-item-actions">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) =>
                                                                updateCartQuantity(item.product_id, parseInt(e.target.value, 10))
                                                            }
                                                            className="cart-item-quantity"
                                                        />
                                                        <button
                                                            className="cart-item-remove"
                                                            onClick={() => removeFromCart(item.product_id)}
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="cart-total">
                                            <p>Gesamt: {calculateTotal()} €</p>
                                        </div>
                                        <button
                                            className="checkout-button"
                                            onClick={() => alert('Zur Kasse gehen!')}
                                        >
                                            Zur Kasse
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <h1>Bitte loggen Sie sich ein, um auf den Shop zuzugreifen.</h1>
                    <button className="login-button" onClick={redirectToLogin}>
                        Zum Login
                    </button>
                </>
            )}
        </div>
    );
};

export default Shop;