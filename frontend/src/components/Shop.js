import React, { useEffect, useState } from 'react';
import '../css/Shop.css';

const Shop = ({ isLoggedIn, setIsLoggedIn, setCurrentPage }) => {
    const [products, setProducts] = useState([]);
    const [modalProduct, setModalProduct] = useState(null); 
    const [cart, setCart] = useState([]);
    const [showCartModal, setShowCartModal] = useState(false);
    const [user, setUser] = useState(null);  // Benutzerdaten im Zustand speichern

    const handleLogin = (userData) => {
        // Speichern der Benutzerdaten im sessionStorage
        sessionStorage.setItem('user_id', userData.id);  // Beachte 'user_id'
        sessionStorage.setItem('email', userData.email);
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }

        // Benutzerdaten aus dem sessionStorage laden
        const userFromSession = {
            user_id: sessionStorage.getItem('user_id'),
            email: sessionStorage.getItem('email'),
          };
          if (userFromSession.user_id && userFromSession.email) {
            setUser(userFromSession);
          }
        }, [setIsLoggedIn]);

    // Produkte abrufen, wenn der Benutzer eingeloggt ist
    useEffect(() => {
        const fetchProducts = async () => {
            if (!isLoggedIn) return;

            try {
                const response = await fetch('http://bcf.mshome.net:4000/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Produkte:', error);
            }
        };

        fetchProducts();
    }, [isLoggedIn]);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    const redirectToLogin = () => {
        setCurrentPage('login');
    };

    const openModal = (product) => {
        setModalProduct(product);
    };

    const closeModal = () => {
        setModalProduct(null);
    };

    const addToCart = () => {
        if (modalProduct && modalProduct.quantity > 0) {
            const updatedCart = [...cart];
            const productIndex = updatedCart.findIndex(item => item.product_id === modalProduct.product_id);

            if (productIndex !== -1) {
                updatedCart[productIndex].quantity += 1;
            } else {
                updatedCart.push({ 
                    ...modalProduct, 
                    quantity: 1, 
                    title: modalProduct.title,
                    price: modalProduct.price 
                });
            }

            setCart(updatedCart);

            const updatedProduct = { ...modalProduct, quantity: modalProduct.quantity - 1 };
            setModalProduct(updatedProduct);
            closeModal();
        }
    };

    const removeFromCart = (productId) => {
        const updatedCart = cart.filter(item => item.product_id !== productId);
        setCart(updatedCart);
    };

    const updateCartQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;  // Verhindert, dass die Menge unter 1 sinkt
    
        const updatedCart = cart.map(item => {
            if (item.product_id === productId) {
                return { ...item, quantity: newQuantity };  // Setze die neue Menge direkt
            }
            return item;
        });
        setCart(updatedCart);
    };

    const openCartModal = () => {
        setShowCartModal(true);
    };

    const closeCartModal = () => {
        setShowCartModal(false);
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    };

    const handleCheckout = async () => {
        if (!user || !user.user_id || !user.email) {
            alert('Fehlende Benutzerdaten: user_id oder email');
            return;
        }

        const orderItems = cart.map(item => ({
            user_id: user.user_id,    // user_id für die Bestellung
            email: user.email,       // Email des Nutzers
            order_date: new Date().toISOString(),  // Datum und Uhrzeit der Bestellung
            product_id: item.product_id,  // Produkt ID
            title: item.title,  // Produkt Titel
            price: item.price,  // Preis des Produkts
            quantity: item.quantity,  // Menge des Produkts
            total_price: (item.price * item.quantity).toFixed(2),  // Gesamtpreis für dieses Produkt
        }));

        // Bestellung an das Backend übermitteln
        try {
            const response = await fetch('/api/order', {
                method: 'PUT',  // PUT-Methode verwenden
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: orderItems }),  // Sende alle Bestellposten als Array
            });

            const result = await response.json();
            if (response.ok) {
                alert('Bestellung erfolgreich!');
                console.log(result);
                // Optional: Leeren des Warenkorbs nach erfolgreichem Checkout
                setCart([]);
            } else {
                alert('Fehler bei der Bestellung: ' + result.message);
            }
        } catch (error) {
            console.error('Fehler beim Checkout:', error);
            alert('Ein unerwarteter Fehler ist aufgetreten.');
        }
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
                        <button className="checkout-button" onClick={handleCheckout}>
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
                                            onClick={handleCheckout}
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
