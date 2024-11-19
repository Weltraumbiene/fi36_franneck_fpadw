import React, { useState, useEffect } from 'react';

const Shop = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Zustand für den Login-Status

  // Überprüfen, ob der Benutzer eingeloggt ist
  useEffect(() => {
    const token = sessionStorage.getItem('token'); // Token aus SessionStorage abrufen
    if (token) {
      setIsLoggedIn(true); // Nutzer ist eingeloggt
    }
  }, []); // Nur beim ersten Rendern prüfen

  return (
    <div>
      {isLoggedIn ? (
        <p>Willkommen im Shop. Sie sind eingeloggt!</p> // Nachricht für eingeloggte Nutzer
      ) : (
        <p>Bitte loggen Sie sich ein, um auf den Shop zuzugreifen.</p> // Nachricht für nicht-eingeloggte Nutzer
      )}
    </div>
  );
};

export default Shop;
