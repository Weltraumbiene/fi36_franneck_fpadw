import React, { useEffect } from 'react';
import '../css/Shop.css';

const Shop = ({ isLoggedIn, setIsLoggedIn }) => {
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
    }
  }, [setIsLoggedIn]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    setIsLoggedIn(false);
  };

  return (
    <div className="shop-container">
      {isLoggedIn ? (
        <>
          <h1>Willkommen im Shop!</h1>
          <p>Drücke den Button, um dich abzumelden.</p>
          <button className="logout-button" onClick={handleLogout}>
            Abmelden
          </button>
        </>
      ) : (
        <p>Bitte loggen Sie sich ein, um auf den Shop zuzugreifen.</p>
      )}
    </div>
  );
};

export default Shop;
