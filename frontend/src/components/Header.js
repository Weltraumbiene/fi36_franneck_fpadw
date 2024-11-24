import React from 'react';
import '../css/Header.css';

const Header = ({ setCurrentPage }) => {
  return (
    <header className="header">
      <div className="logo" onClick={() => setCurrentPage('home')}>
        Autoteile24-intern
      </div>
      <nav>
        <button onClick={() => setCurrentPage('home')}>Start</button>
        <button onClick={() => setCurrentPage('login')}>Anmelden</button>
        <button onClick={() => setCurrentPage('shop')}>Shop</button>
        <button onClick={() => setCurrentPage('contact')}>Kontakt</button>
        <button onClick={() => setCurrentPage('imprint')}>Impressum</button>
      </nav>
    </header>
  );
};

export default Header;