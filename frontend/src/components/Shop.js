import React, { useEffect, useState } from 'react';
import Conf from './Conf'; // Importiere die Konfiguration

const Shop = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Prüfe, ob der User eingeloggt ist
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    // Hole Produkte vom Backend
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${Conf.apiUrl}/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Fehler beim Laden der Produkte:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Shop</h1>
      <p>{isLoggedIn ? 'Willkommen im Shop!' : 'Bitte logge dich ein.'}</p>
      <div className="products-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>{product.price} €</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;

