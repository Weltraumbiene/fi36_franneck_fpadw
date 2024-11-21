import React, { useEffect, useState } from 'react';
import '../css/Shop.css';

const Shop = ({ isLoggedIn }) => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
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
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (products.length === 0) {
        return <div>Produkte werden geladen...</div>;
    }

    return (
        <div className="shop-container">
            <h1>Shop</h1>
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
        </div>
    );
};

export default Shop;
