import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Shop from './components/Shop';
import Contact from './components/Contact';
import Imprint from './components/Imprint';
import ScrollButtons from './components/ScrollButtons';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Zustand für den Login-Status

  return (
    <div className="App">
      <Header />
      <Home />
      <Login setIsLoggedIn={setIsLoggedIn} /> {/* Funktion als Prop übergeben */}
      <Shop isLoggedIn={isLoggedIn} /> {/* Login-Status an Shop weitergeben */}
      <Contact />
      <Imprint />
      <ScrollButtons />
      <Footer />
    </div>
  );
};

export default App;
