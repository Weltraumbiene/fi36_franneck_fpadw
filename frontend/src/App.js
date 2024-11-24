import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Shop from './components/Shop';
import Contact from './components/Contact';
import Imprint from './components/Imprint';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login-Status
  const [currentPage, setCurrentPage] = useState('home'); // Aktuelle Seite

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'login':
        return <Login setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} />; // `setCurrentPage` übergeben
      case 'shop':
        return <Shop isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />;
      case 'contact':
        return <Contact />;
      case 'imprint':
        return <Imprint />;
      default:
        return <Home />;
    }
  };
  

  return (
    <div className="App">
      <Header setCurrentPage={setCurrentPage} />
      {renderPage()}
      <Footer />
    </div>
  );
};

export default App;