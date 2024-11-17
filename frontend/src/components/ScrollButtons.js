import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import '../css/ScrollButtons.css';

const ScrollButtons = () => {
  const [showTopButton, setShowTopButton] = useState(false);
  const [showBottomButton, setShowBottomButton] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null); // Zustand für Timeout-ID

  // Funktion um zu überprüfen, ob der Benutzer nach unten gescrollt hat
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowTopButton(true);
    } else {
      setShowTopButton(false);
    }

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
      setShowBottomButton(false);
    } else {
      setShowBottomButton(true);
    }

    // Wenn der Benutzer gescrollt hat, setze die Buttons sichtbar und starte einen Timer, um sie wieder auszublenden
    if (timeoutId) {
      clearTimeout(timeoutId); // Lösche den vorherigen Timer
    }

    const id = setTimeout(() => {
      setShowTopButton(false);
      setShowBottomButton(false);
    }, 1250); // Setze den Timeout auf 1 Sekunde
    setTimeoutId(id); // Speichere die Timeout-ID
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Lösche den Timeout, wenn die Komponente entfernt wird
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]); // Abhängig von timeoutId, damit der Timer immer aktualisiert wird

  return (
    <>
      {/* Scroll-Up Button */}
      {showTopButton && (
        <Link
          to="start"
          smooth={true}
          duration={500}
          className="scroll-button scroll-up"
        >
          ↑
        </Link>
      )}

      {/* Scroll-Down Button */}
      {showBottomButton && (
        <Link
          to="impressum"
          smooth={true}
          duration={500}
          className="scroll-button scroll-down"
        >
          ↓
        </Link>
      )}
    </>
  );
};

export default ScrollButtons;
