import React from 'react';
import '../css/Imprint.css';


const Imprint = () => {
  return (
    <section id="impressum" className="section">
      <h1>Impressum</h1>
      <div className="imprint-container">
        {/* Box 1 */}
        <div className="imprint-box">
          <h2>Kontakt</h2>
          <br></br>
          <p>Autoteile24 - Intern GmbH</p>
          <p>Beispielstraße 12</p>
          <p>12345 Musterhausen</p>
          <p>Telefon: <a href="tel:+491287654321">+49 12 87654321</a></p>
          <p>Email: <a href="mailto:kontakt@autoteile24-intern.de">kontakt@autoteile24-intern.de</a></p>
          <p>Steuer: 123-456-789-10</p>
        </div>

        {/* Box 2 */}
        <div className="imprint-box">
          <h2>Verantwortlich für die Webpräsenz</h2>
          <br></br>
          <p>Benjamin Franneck</p>
          <p>Wohnhaft Allee 21</p>
          <p>12345 Berlin</p>
          <p>Telefon: <a href="tel:+49123454387699">+49 1234 543 876 99</a></p>
          <p>Email: <a href="mailto:Admin@Autoteile24-intern.de">Admin@Autoteile24-intern.de</a></p>
        </div>
      </div>
      <p></p>
      <p></p>
      <p>© 2024 fi36_franneck_fpadw. Hier können rechtliche Hinweise stehen.</p>
    </section>
  );
};

export default Imprint;
