import React, { useState } from 'react';
import '../css/Register.css';

const Register = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');

  // Formular-Submit-Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Passwort-Überprüfung
    if (password !== confirmPassword) {
      setStatus('Passwörter stimmen nicht überein.');
      return;
    }

    // API-Anfrage senden
    try {
      const response = await fetch('http://bcf.mshome.net:4000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(
          <>
            Erfolgreich registriert!<br />
            Sie können sich nun dieses Fenster schließen und sich anmelden.
          </>
        );
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setStatus(data.message || 'Registrierung fehlgeschlagen.');
      }
    } catch (error) {
      setStatus('Fehler beim Registrieren. Bitte versuche es erneut.');
    }
  };

  return (
    // Modal Overlay
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Schließen-Button */}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h1>Registrieren</h1>

        {/* Statusnachricht */}
        {status && <div className="register-message">{status}</div>}

        {/* Formular */}
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
    </div>
  );
};

export default Register;
