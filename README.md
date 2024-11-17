13.11.2024
ich hab eine Datenbank mit dem Namen fi36_franneck_fpadw erstellt. In der sind vier Tabellen. Die erste Tabelle heißt user und speichert die E-Mail-Adressen und Passwörter der Benutzer. Die E-Mail-Adresse ist dabei der Hauptschlüssel, also eindeutig für jeden Benutzer. Dann gibt es die Tabelle product, in der Produkte gespeichert werden. Da sind die Spalten für den Namen des Produkts und die Menge, die auf Lager ist. Die Menge ist standardmäßig auf 0 gesetzt.

Die nächste Tabelle heißt order und da werden Bestellungen von Nutzern gespeichert. Jede Bestellung hat eine eigene ID, die E-Mail des Nutzers, der bestellt hat, und das Bestelldatum. Wenn der Nutzer gelöscht wird, bleibt die Bestellung trotzdem in der Tabelle, aber die E-Mail wird auf null gesetzt.

Die letzte Tabelle heißt order_item und da wird gespeichert, welche Produkte in einer Bestellung enthalten sind. Da steht die Menge jedes Produkts, das bestellt wurde, sowie Verweise auf die Bestell-ID und die Produkt-ID. Wenn eine Bestellung oder ein Produkt gelöscht wird, verschwinden auch die zugehörigen Einträge in dieser Tabelle.

Alle Tabellen sind miteinander verknüpft, sodass man immer genau weiß, welche Bestellungen zu welchem Nutzer und welche Produkte zu einer Bestellung gehören.

So zumindest die Theorie! :D
Ich habe einen SQL Dump bereits commitet (nicht als Teil der Projektabgabe)


14.11.2024
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

16.11.2024
Ich hab mithilfe von Unterrichtsmaterialien einen React-Server zum laufen gebracht. Der Server ist soweit startklar und wird jetzt nach und nach an die Anforderungen vom Projekt angepasst. Momentan dient das ganze nur als Gerüst, auf dem ich das eigentliche Projekt aufbauen werde. Es ist also noch nichts fertiges, sondern mehr eine Basis, mit der ich weiterarbeiten kann.

17.11.2024
Das Layout wurde auf SPA umgestellt und den Projektanforderungen angepasst. Für die Warbarkeit wurde ein ausgelagerter Footer und Header implementiert. Für eine intuitive 
Benutzung sind direkt auf der Startseite zwei CTA Buttons erstellt worden. Login und Kontakt.
Im Footer könnte man rechtliche Hinweise einbinden, aber gegenwärtig dient er nur als Platzhalter.