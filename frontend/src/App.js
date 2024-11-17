import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Shop from './components/Shop';
import Contact from './components/Contact';
import Imprint from './components/Imprint';

const App = () => {
  return (
    <div>
      <Header />

      {/* Scrollbare Sektionen */}
      <Home />
      <Shop />
      <Contact />
      <Imprint />

      <Footer />
    </div>
  );
};

export default App;
