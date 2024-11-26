import React, { useEffect, useState } from 'react';
import '../css/Shop.css';

const Shop = ({ isLoggedIn, setIsLoggedIn, setCurrentPage }) => {
    const [products, setProducts] = useState([]);
    const [modalProduct, setModalProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const [showCartModal, setShowCartModal] = useState(false);

    const [userEmail, setUserEmail] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            setIsLoggedIn(false);
        } else {
            setIsLoggedIn(true);
            const email = sessionStorage.getItem('email');
            const id = sessionStorage.getItem('userId');
            setUserEmail(email || 'Unbekannt');
            setUserId(id || 'Unbekannt');
        }
    }, [setIsLoggedIn]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!isLoggedIn) return;

            try {
                const response = await fetch('http://bcf.mshome.net:4000/api/products');
                setProducts(await response.json());
            } catch (error) {
                console.error('Fehler beim Abrufen der Produkte:', error);
            }
        };

        fetchProducts();
    }, [isLoggedIn]);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('email');
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
                updatedCart.push({ ...modalProduct, quantity: 1 });
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
        if (isNaN(newQuantity) || newQuantity < 1) return;

        setCart(prevCart =>
            prevCart.map(item => {
                if (item.product_id === productId) {
                    const originalProduct = products.find(p => p.product_id === productId);
                    const maxAvailable = originalProduct ? originalProduct.quantity : item.quantity;

                    return { ...item, quantity: Math.min(newQuantity, maxAvailable) };
                }
                return item;
            })
        );
    };

    const openCartModal = () => {
        setShowCartModal(true);
    };

    const closeCartModal = () => {
        setShowCartModal(false);
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0).toFixed(2);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert('Ihr Warenkorb ist leer. Bitte fügen Sie Produkte hinzu.');
            return;
        }
    
        const orderId = `ORDER-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 12)}-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`;
    
        const orderDate = new Date().toISOString();
    
        const orderItems = cart.map(item => ({
            order_id: orderId,
            user_id: userId,
            email: userEmail,
            order_date: orderDate,
            product_id: item.product_id,
            title: item.title,
            price: Number(item.price),
            quantity: item.quantity,
            total_price: (Number(item.price) * item.quantity).toFixed(2),
        }));
    
        try {
            const response = await fetch('http://bcf.mshome.net:4000/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderItems }),
            });
    
            if (response.ok) {
                alert(`Bestellung erfolgreich abgeschlossen! Bestellnummer: ${orderId}`);
                setCart([]);
            } else {
                throw new Error('Fehler beim Abschließen der Bestellung');
            }
        } catch (error) {
            console.error('Fehler bei der Bestellung:', error);
            alert('Beim Abschluss der Bestellung ist ein Fehler aufgetreten.');
        }
    };

    return (
        <div className="shop-container">
            {isLoggedIn ? (
                <>
                    <h1>Willkommen im Shop!</h1>
                    <p>Hallo {userEmail}! Deine Benutzer-ID ist: {userId}</p>

                    <div className="button-container">
                        <button className="cart-button" onClick={openCartModal}>
                            Warenkorb ({cart.length})
                        </button>
                        <button className="checkout-button" onClick={handleCheckout}>
                            Bestellung bestätigen
                        </button>
                        <button className="logout-button" onClick={handleLogout}>
                            Abmelden
                        </button>
                        {userEmail === 'admin@at24intern.de' && (
                            <button 
                                className="admin-button" 
                                style={{ backgroundColor: 'red', color: 'white' }}
                                onClick={() => setCurrentPage('admin')}
                            >
                                Admin
                            </button>
                        )}
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
                                    Preis: {Number(product.price).toFixed(2)} €
                                </p>
                            </div>
                        ))}
                    </div>

                    {modalProduct && (
                        <div className="modal-overlay show">
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
                                    Preis: {Number(modalProduct.price).toFixed(2)} €
                                </p>
                                <button className="shop-button" onClick={addToCart}>
                                    In den Warenkorb
                                </button>
                            </div>
                        </div>
                    )}

                    {showCartModal && (
                        <div className="cart-modal-overlay show">
                            <div className="cart-modal-content">
                                <h1>Warenkorb</h1>

                                {cart.length === 0 ? (
                                    <>
                                        <p>Der Warenkorb ist leer.</p>
                                        <button className="cart-modal-close" onClick={closeCartModal}>
                                            Warenkorb schließen
                                        </button>
                                    </>
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
                                                    <span className="cart-item-price">
                                                        {Number(item.price).toFixed(2)} €
                                                    </span>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        min="1"
                                                        max={products.find(p => p.product_id === item.product_id)?.quantity || item.quantity}
                                                        onChange={(e) =>
                                                            updateCartQuantity(item.product_id, parseInt(e.target.value, 10))
                                                        }
                                                        className="cart-item-quantity"
                                                    />
                                                    <span className="cart-item-total-price">
                                                        {(Number(item.price) * item.quantity).toFixed(2)} €
                                                    </span>
                                                    <button
                                                        className="cart-item-remove"
                                                        onClick={() => removeFromCart(item.product_id)}
                                                    >
                                                        X
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="cart-total">
                                            <h6>Gesamtpreis: {calculateTotal()} €</h6>
                                        </div>
                                        <button className="checkout-button" onClick={handleCheckout}>
                                            Bestellung bestätigen
                                        </button>
                                        <button className="cart-modal-close" onClick={closeCartModal}>
                                            Warenkorb schließen
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="login-prompt">
                    <h2>Du musst eingeloggt sein, um den Shop zu sehen</h2>
                    <button onClick={redirectToLogin}>Zum Login</button>
                </div>
            )}
        </div>
    );
};

export default Shop;
