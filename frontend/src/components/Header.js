// src/components/Header.js
import React from 'react';
import '../App.css';

const Header = () => {
  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="header">
      <div className="logo">Autoteile24-intern</div>
      <nav>
        <button onClick={() => scrollToSection('shop')}>Login</button>
        <button onClick={() => scrollToSection('kontakt')}>Kontakt</button>
      </nav>
    </header>
  );
};

export default Header;
