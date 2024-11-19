import React, { useEffect, useState } from 'react';
import Conf from './Conf'; // Importiere die Konfiguration
import jwt_decode from 'jwt-decode';

const Shop = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        // Prüfe, ob der Token abgelaufen ist
        if (decodedToken.exp * 1000 < Date.now()) {
          setMessage('Ihre Sitzung ist abgelaufen. Bitte loggen Sie sich erneut ein.');
          sessionStorage.removeItem('token');
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Fehler bei der Token-Verifizierung:', error);
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${Conf.apiUrl}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setMessage('Produkte konnten nicht geladen werden.');
        }
      } catch (error) {
        console.error('Fehler beim Laden der Produkte:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Shop</h1>
      <p>{isLoggedIn ? 'Willkommen im Shop!' : message || 'Bitte logge dich ein.'}</p>
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
