import React from 'react';

const Shop = ({ isLoggedIn }) => {
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
