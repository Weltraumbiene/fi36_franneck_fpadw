import React, { useState, useEffect } from 'react';
import './App.css';

import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import Home from './components/Home';
import Contact from './components/Contact';
import Navigation from './components/Navigation';
import Login from './components/Login';
import UserProfile from './components/UserProfile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Prüfen, ob ein Token und userId im Local Storage vorhanden ist
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');

    if (token && storedUserId) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="App">
      <Navigation isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
