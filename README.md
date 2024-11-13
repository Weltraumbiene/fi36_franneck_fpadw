Einrichtung der API:

Ich habe eine API mit Express erstellt, die grundlegende Funktionen wie Registrierung (/register), Login (/login) und eine geschützte Profilseite (/profile) umfasst. Um die Benutzerdaten sicher zu übertragen und zu verifizieren, habe ich JSON Web Tokens (JWT) genutzt. Die Passwörter werden mit bcrypt sicher gehasht, bevor sie in der Datenbank gespeichert werden. Die Verbindung zur MariaDB-Datenbank läuft über das mariadb-Modul, wobei alle sensiblen Daten in der secrets.js-Datei gespeichert sind.

Fehlerbehebung und Anpassungen:

Es gab anfangs Probleme mit den Importen von secrets.js und db.js, da die Pfade nicht korrekt waren. Das habe ich schnell behoben, indem ich die richtigen Verweise auf die Dateien gesetzt habe.

API-Verbindungen und Endpunkte:

Ich habe die API auf Port 4000 gestartet und sie unter der Basis-URL http://bcf.mshome.net:4000 verfügbar gemacht. Um CORS-Probleme zu vermeiden und Anfragen von meinem Frontend (React auf localhost:3000) zuzulassen, habe ich die CORS-Middleware richtig konfiguriert.

Tests der Endpunkte mit curl:

    Registrierung: Ich habe die Registrierung getestet, indem ich einen POST-Request an /api/register geschickt habe. Das hat erfolgreich einen neuen Benutzer erstellt und mir ein Token zurückgegeben:

curl -X POST http://bcf.mshome.net:4000/api/register \
-H "Content-Type: application/json" \
-d '{"email": "test@example.com", "password": "deinPasswort"}'

Login: Der Login-Endpoint funktioniert auch gut. Nachdem ich mich mit den gleichen Daten eingeloggt habe, habe ich ein Token erhalten:

curl -X POST http://bcf.mshome.net:4000/api/login \
-H "Content-Type: application/json" \
-d '{"email": "test@example.com", "password": "deinPasswort"}'

Profil-Route: Mit dem erhaltenen Token konnte ich die geschützte Profilseite (/api/profile) abrufen:

curl -X GET http://bcf.mshome.net:4000/api/profile \
-H "Authorization: Bearer <TOKEN>"
