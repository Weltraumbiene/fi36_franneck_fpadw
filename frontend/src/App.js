import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Shop from './components/Shop';
import Contact from './components/Contact';
import Imprint from './components/Imprint';
import ScrollButtons from './components/ScrollButtons';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Home />
      <Shop />
      <Contact />
      <Imprint />
      <ScrollButtons />
      <Footer />
    </div>
  );
};

export default App;
