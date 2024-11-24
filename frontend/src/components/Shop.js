import React, { useEffect, useState } from 'react';
import '../css/Shop.css';

const Shop = ({ isLoggedIn, setIsLoggedIn }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
    } else {
      // Laden der Benutzerinformationen aus sessionStorage
      const email = sessionStorage.getItem('email');
      const id = sessionStorage.getItem('userId');
      setUserEmail(email || 'Unbekannt'); // Falls keine E-Mail vorhanden ist
      setUserId(id || 'Unbekannt');      // Falls keine Benutzer-ID vorhanden ist
    }
  }, [setIsLoggedIn]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('email');
    setIsLoggedIn(false);
  };

  return (
    <div className="shop-container">
      {isLoggedIn ? (
        <>
          <h1>Willkommen im Shop!</h1>
          <p>Hallo {userEmail}! Deine Benutzer-ID ist: {userId}</p>
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
