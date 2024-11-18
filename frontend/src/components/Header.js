import React from 'react';
import '../css/Header.css';

const Header = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header">
      {/* Logo mit Klickfunktion */}
      <div className="logo" onClick={scrollToTop}>
        Autoteile24-intern
      </div>
      <nav>
  <button onClick={() => scrollToSection('start')}>Start</button> {/* Von 'home' zu 'start' */}
  <button onClick={() => scrollToSection('login')}>Anmelden</button>
  <button onClick={() => scrollToSection('contact')}>Kontakt</button>
  <button onClick={() => scrollToSection('impressum')}>Impressum</button> {/* Von 'imprint' zu 'impressum' */}
</nav>
    </header>
  );
};

export default Header;
