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
Zuerst habe ich das Frontend für das Kontaktformular in React erstellt. Dabei verwendete ich die useState-Hooks, um die Eingaben des Nutzers (Name und Nachricht) sowie den Status des Formulars zu verwalten. Ich entwickelte eine handleSubmit-Funktion, die beim Absenden des Formulars die Daten an das Backend schickte. Dazu benutzte ich das fetch-API, um eine POST-Anfrage an den Server zu senden. Wenn die Anfrage erfolgreich war, wurde eine Bestätigung angezeigt, andernfalls wurde eine Fehlermeldung eingeblendet. Ich kümmerte mich auch um die Eingabefelder und den Absende-Button, um das Formular benutzerfreundlich und funktional zu gestalten.

Im Backend erstellte ich eine API mit Node.js und Express, die auf POST-Anfragen an den Endpunkt /contact reagiert. Die Anfragen wurden auf die erforderlichen Felder (Name und Nachricht) überprüft, bevor die Daten in eine MariaDB-Datenbank gespeichert wurden. Ich verwendete dafür einen Verbindungspool von mariadb, um sicherzustellen, dass die Kommunikation mit der Datenbank effizient und stabil war. Das Backend gab dann eine Antwort zurück, die dem Frontend mitteilt, ob die Nachricht erfolgreich gespeichert wurde oder ein Fehler aufgetreten ist.

Um sicherzustellen, dass Frontend und Backend miteinander kommunizieren können, konfigurierte ich CORS im Backend, sodass Anfragen von der Domain http://bcf.mshome.net:3000 zugelassen wurden. Ich überprüfte die Verbindung zwischen den beiden Komponenten, indem ich das Kontaktformular im Frontend ausfüllte und sicherstellte, dass die Daten korrekt im Backend verarbeitet und in die Datenbank gespeichert wurden.

Für die Speicherung der Kontaktanfragen richtete ich in meiner MariaDB-Datenbank eine Tabelle namens contact ein, die die Felder id, created_at, name und message enthielt. Die Datenbankstruktur war darauf ausgelegt, die eingehenden Nachrichten effizient zu speichern. Ich überprüfte die Speicherung der Daten regelmäßig, indem ich SQL-Abfragen wie SELECT * FROM contact\G verwendete, um die gespeicherten Nachrichten zu inspizieren.

Um das Kontaktformular optisch ansprechend zu gestalten, erstellte ich eine CSS-Datei, die das Layout definierte. Das Formular wurde so positioniert, dass es immer in der Mitte des Bildschirms angezeigt wird, unabhängig von der Bildschirmgröße. Die Formularfelder und der Absende-Button wurden so gestylt, dass sie benutzerfreundlich und ansprechend wirken. Ich beschränkte die Breite des Formulars auf 600px, um eine bessere Lesbarkeit zu gewährleisten.

Nachdem das Formular erstellt und das Backend eingerichtet war, testete ich die Anwendung, um sicherzustellen, dass alle Komponenten richtig miteinander kommunizierten. Dabei verwendete ich auch curl, um sicherzustellen, dass die API-Endpunkte des Backends korrekt funktionierten. Im Falle von Fehlern passte ich den Code an, um die Fehler zu beheben. Ein spezifischer Fehler, den ich während der Entwicklung bemerkte, war, dass MariaDB beim Einfügen von Daten in die Tabelle mit einem BigInt-Wert Probleme hatte, was ich durch Anpassung der SQL-Abfragen löste.

Als letzten Schritt fügte ich die Möglichkeit hinzu, einzelne Datensätze aus der Datenbank zu löschen, indem ich eine SQL-Abfrage verwendete, die Datensätze nach ihrer id löschte. Diese Funktion stellte sicher, dass ich einzelne Anfragen problemlos aus der Datenbank entfernen konnte.

Abschließend kann ich sagen, dass ich eine funktionierende Lösung entwickelt habe, bei der das Kontaktformular im Frontend mit React erstellt wurde, das Backend in Node.js und Express läuft und die Daten in einer MariaDB-Datenbank gespeichert werden. Die Anwendung ist robust, sicher und benutzerfreundlich, und ich konnte alle notwendigen Funktionen erfolgreich implementieren.

18.11.2024 -zwischenschritt- 

Zunächst habe ich eine .env-Datei erstellt, die als zentrale Stelle für alle Umgebungsvariablen dient, die sowohl im Backend als auch im Frontend verwendet werden. Diese Datei ist besonders nützlich, um sensible Daten wie API-Schlüssel, Datenbank-Verbindungsinformationen und andere vertrauliche Daten sicher zu speichern. In dieser Datei habe ich die Konfiguration für die Backend-Umgebung vorgenommen, z. B. den Port und den Datenbank-URL für die Verbindung zum Backend.

Im Backend habe ich eine API für den Login-Mechanismus entwickelt, die mit einer POST-Anfrage übermittelt wird. Der Nutzer gibt dabei seine E-Mail-Adresse und sein Passwort ein. Diese Daten werden an den Server gesendet, wo sie mit den in der Datenbank gespeicherten Werten verglichen werden. Wenn die Daten korrekt sind, wird ein JWT (JSON Web Token) generiert und an den Client zurückgeschickt.

Zunächst habe ich dafür gesorgt, dass die API für das Login im Backend korrekt funktioniert. Hierbei habe ich sicher gestellt, dass:

    Die Benutzeranmeldedaten (E-Mail und Passwort) über eine POST-Anfrage im Body der Anfrage gesendet werden.
    Der Server die Daten überprüft, indem er die E-Mail und das Passwort mit den in der Datenbank gespeicherten Werten vergleicht.
    Bei erfolgreicher Authentifizierung wird ein JWT erstellt und an den Client übermittelt.
    Bei fehlerhaften Anmeldedaten wird eine Fehlermeldung an den Client zurückgegeben.

In der Backend-API habe ich auch eine grundlegende Fehlerbehandlung hinzugefügt, um sicherzustellen, dass bei einem fehlerhaften Login-Versuch eine entsprechende Fehlermeldung angezeigt wird.

Im Frontend habe ich eine Login-Komponente in React entwickelt. Diese Komponente enthält ein Formular, in das der Benutzer seine E-Mail und sein Passwort eingeben kann. Bei Absenden des Formulars wird die Login-API im Backend aufgerufen, und die Anmeldedaten werden über eine Fetch-API-Anfrage an den Server gesendet.

Hier sind die wichtigsten Schritte, die ich in der Login-Komponente umgesetzt habe:

    Eingabe von E-Mail und Passwort: Die Benutzer können ihre E-Mail-Adresse und ihr Passwort in die entsprechenden Eingabefelder eingeben.
    Anfrage an die API: Beim Absenden des Formulars wird die handleSubmit-Funktion aufgerufen, die eine POST-Anfrage an die Backend-API sendet. Hierbei werden die E-Mail und das Passwort als JSON im Body der Anfrage übermittelt.
    Antwort verarbeiten: Wenn der Server ein JWT zurückgibt, speichere ich dieses Token im localStorage, um den Benutzer für zukünftige Anfragen zu authentifizieren. Ich speichere auch die userId, die mit dem Token zurückgegeben wird, um den eingeloggten Benutzer später zu identifizieren.
    Fehlermeldungen: Wenn der Login fehlschlägt, zeige ich eine entsprechende Fehlermeldung an, die entweder aus der Antwort des Servers kommt oder eine allgemeine Fehlermeldung ist.

Durch den Einsatz von React's useState-Hook habe ich den Status der Formulardaten sowie etwaige Fehlermeldungen verwaltet, und mit useNavigate stelle ich sicher, dass der Benutzer nach erfolgreichem Login zur Startseite weitergeleitet wird.

Die Authentifizierung wird über JWT (JSON Web Tokens) abgewickelt. Das JWT wird vom Server nach erfolgreicher Anmeldung erzeugt und an den Client gesendet. Dieses Token wird im localStorage des Browsers gespeichert, sodass der Benutzer auch nach dem Neuladen der Seite eingeloggt bleibt. Beim nächsten Zugriff auf gesicherte Bereiche der Anwendung wird das Token an den Server geschickt, um den Benutzer zu authentifizieren.

Im Frontend habe ich sicherstellt, dass das Token bei jeder API-Anfrage, die eine Authentifizierung erfordert, im Authorization-Header der Anfrage mitgeschickt wird. Dadurch kann der Server das Token validieren und die Anfrage nur dann bearbeiten, wenn es sich um einen authentifizierten Benutzer handelt.

Auf der Backend-Seite habe ich die Routen, die eine Authentifizierung erfordern, mit einem Middleware-Mechanismus abgesichert. Die Middleware überprüft, ob ein gültiges JWT im Header der Anfrage enthalten ist. Wenn das Token fehlt oder ungültig ist, wird der Zugriff auf die gesicherten Routen verweigert. Wenn das Token gültig ist, kann der Benutzer auf die angeforderte Ressource zugreifen.

Ich habe dies durch die Implementierung einer authMiddleware-Funktion erreicht, die das Token entschlüsselt und verifiziert. Bei einer erfolgreichen Validierung wird die Anfrage an die entsprechende Route weitergeleitet, andernfalls wird eine Fehlermeldung zurückgegeben.

Im Frontend verwalte ich den Login-Status des Benutzers mithilfe eines globalen States, der in einem übergeordneten App-Komponenten-Wrapper gesetzt wird. Wenn der Benutzer sich erfolgreich anmeldet, wird der setIsLoggedIn-State auf true gesetzt. Auf dieser Basis wird entschieden, ob der Benutzer auf die Startseite oder auf eine Login-Seite weitergeleitet wird.

Ich habe auch sicherstellt, dass bestimmte Routen, die nur für eingeloggte Benutzer zugänglich sind (wie z.B. das Dashboard), nur dann angezeigt werden, wenn der Benutzer authentifiziert ist. Das habe ich durch eine einfache Prüfung des Tokens im localStorage erreicht.

Zuletzt habe ich auf beiden Seiten (Frontend und Backend) robuste Fehlerbehandlung eingebaut. Wenn beim Login oder bei der Registrierung Fehler auftreten, werden klare Fehlermeldungen angezeigt, die den Benutzer darüber informieren, was schiefgegangen ist. Auf der Frontend-Seite zeige ich diese Fehlermeldungen in der Login- und Registrierungsform an, während im Backend auch entsprechende HTTP-Statuscodes zurückgegeben werden (z.B. 401 für "Unauthorized" oder 500 für interne Serverfehler).


19.11.2024
Heute hatte ich einige Herausforderungen bei der Implementierung der Login-Funktion und der Integration des Shops in meine React-App. Anfangs war das Projekt recht einfach: Ich wollte ein Login-System erstellen, bei dem Benutzer sich anmelden und danach auf eine Shop-Seite weitergeleitet werden. Allerdings stieß ich schon früh auf Probleme, die mich einige Zeit gekostet haben.

Zu Beginn gab es Schwierigkeiten mit CORS, was dazu führte, dass meine React-App keine Verbindung zur API herstellen konnte. Der Browser blockierte die Anfragen aufgrund von Sicherheitsvorgaben, weil die App und die API auf verschiedenen Domains liefen. Ich musste also sicherstellen, dass die API die richtigen CORS-Header sendet, um diese Anfragen zu erlauben. Nachdem ich diese Änderungen auf der Server-Seite vorgenommen hatte, konnte ich die API problemlos ansprechen.

Ein weiteres Problem trat bei der Weiterleitung nach einem erfolgreichen Login auf. Zuallererst verwendete ich window.location.href = '/shop', um den Benutzer nach dem Login auf die Shop-Seite weiterzuleiten. Doch diese Lösung führte dazu, dass die ganze Seite neu geladen wurde, was wiederum den Zustand zurücksetzte und die App ineffizient machte. Daher entschloss ich mich, das Routing in der App anders zu handhaben. Anstatt die Seite neu zu laden, setzte ich den currentPage-Zustand in App.js, um die Seite zu wechseln, ohne dass ein komplettes Neuladen der App nötig war. Dadurch blieb der Zustand erhalten, und die Seite wechselte elegant zur Shop-Seite.

In der Shop-Komponente war es anfangs so, dass der Benutzer einfach eingeloggt sein musste, um den Shop-Inhalt zu sehen. Ich habe den Zustand isLoggedIn verwendet, um zu prüfen, ob der Benutzer eingeloggt ist oder nicht. Wenn der Benutzer nicht eingeloggt war, bekam er eine Nachricht, dass er sich einloggen müsse, um den Shop zu sehen. Außerdem wollte ich einen Logout-Button einbauen, der es dem Benutzer ermöglicht, sich abzumelden. Beim Drücken des Buttons wurde der sessionStorage gelöscht, und der Benutzer wurde zurück zur Login-Seite weitergeleitet.

Der Shop-Container war anfangs nicht optimal gestylt und sah ziemlich leer aus. Also habe ich ihn mit ein paar CSS-Regeln zentriert, damit der Inhalt schön in der Mitte der Seite angezeigt wird. Dabei habe ich auch den Logout-Button angepasst und ihn rot gemacht, mit weißer Schrift, um ihn visuell hervorzuheben.

Am Ende des Tages funktionierte alles ziemlich gut. Die Login-Funktion wurde richtig integriert, der Shop wurde nur angezeigt, wenn der Benutzer eingeloggt war, und der Logout-Button tut genau das, was er soll. Ich habe gelernt, wie wichtig es ist, den Zustand in einer React-App richtig zu verwalten und wie man CORS-Probleme in den Griff bekommt, wenn man mit APIs arbeitet.