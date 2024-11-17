import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <div>
      <Header />

      {/* Scrollbare Sektionen */}
      <section id="start" className="section">
        <h1>Willkommen</h1>
        <p>Startbereich Anwendung</p>
      </section>

      <section id="shop" className="section">
        <h1>Shop/Login</h1>
        <p>Hier ist der Login-Bereich oder Shop-Inhalte.</p>
      </section>

      <section id="kontakt" className="section">
        <h1>Kontakt</h1>
        <p>Hier finden Sie das Kontaktformular.</p>
      </section>

      <section id="impressum" className="section">
        <h1>Impressum</h1>
        <p>Hier steht Ihr Impressum.</p>
      </section>

      <Footer />
    </div>
  );
};

export default App;
