import React, { useState } from 'react';
import '../css/Register.css'; // Verweis auf das CSS für Register

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwörter stimmen nicht überein.');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Erfolgreich registriert! Sie können sich nun anmelden.');
      } else {
        setMessage(data.message || 'Registrierung fehlgeschlagen.');
      }
    } catch (error) {
      console.error('Fehler bei der Registrierung:', error);
      setMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    }
  };

  return (
    <section id="register" className="register-section">
      <div className="register-container">
        <h1>Registrieren</h1>
        {message && <div className="register-message">{message}</div>}
        <form onSubmit={handleSubmit} className="register-form">
          <label htmlFor="email">E-Mail</label>
          <input
            id="email"
            type="email"
            placeholder="E-Mail-Adresse eingeben"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Passwort</label>
          <input
            id="password"
            type="password"
            placeholder="Passwort eingeben"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="confirmPassword">Passwort bestätigen</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Passwort bestätigen"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="register-button">
            Registrieren
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;