## Aufbau der Webanwendung

**Achtung: Enhält maschinelle Übersetzungen**

<!-- use H5 with underscore for link targets -->

Es gibt 7 Seiten. Diese sind besonders interessant: [Geschichten](/instructions#stories_), [Anleitungen](/instructions#tutorial_) und [Arbeitsbereich](/instructions#workspace_). Die Beschreibung folgt der Reihenfolge im Menu.

<!-- 
There are 7 levels

  * ![](/img/tutor/coffee.png) General Information
  * ![](/img/tutor/opendata.png) Open Data
  * ![](/img/tutor/stories.png) Stories 
  * ![](/img/tutor/tutorial.png) Tutorial 
  * ![](/img/tutor/workspace.png) Workspace 
  * ![](/img/tutor/advanced.png) Advanced 
  * ![](/img/tutor/account.png) Account 

-->

### Über Daten.Cafe

<img src="/img/tutor/coffee.png" class="large">

Eine kurze Einführung in die Ziele und die Zielgruppe von Daten.Cafe
Open Data


### Offene Daten

<img src="/img/tutor/opendata.png" class="large">

Einführung in und Überblick über Open-Data-Konzepte, Datenquellen und Anwendungen. Diese Sektion fehlt noch vollständig, tut uns leid.

<!-- use H5 with underscore for link target -->

##### Stories_
### Geschichten

<img src="/img/tutor/stories.png" class="large">


Daten-Geschichten und Beispiele. Wir haben bisher nur eine verwendbare Geschichte, probiere sie aus.

Erstelle deine eigenen Geschichten und teile sie mit Freunden und Kollegen. Gib einfach die Datei weiter, die du aus dem Arbeitsbereich herunterladen kannst.

##### Tutorial_
### Anleitung

<img src="/img/tutor/tutorial.png" class="large">

Die Tutorial-Sektion. Du bist genau hier ...

##### Workspace_
### Arbeitsbereich

<img src="/img/tutor/workspace.png" class="large">

Der Arbeitsbereich hat 2 Felder. Der Flow-Editor befindet sich links oder oben (auf Mobilgeräten) und das Visualisierungsfenster befindet sich rechts oder unten. Sie erstellen Ihren Workflow im Flow-Editor.

#### Werkzeugleiste

IN der Werkzeugleiste finden Sie alles Nötige, insbesondere:

<img src="/img/tutor/toolbar-empty.png" class="wide">

  * ![](/img/tutor/help.png) Hilfe
  * ![](/img/tutor/editStory.png) Geschichte bearbeiten
  * ![](/img/tutor/upload.png) Workflow hochladen
  * ![](/img/tutor/download.png) Workflow herunterladen 
  * ![](/img/tutor/trash.png) Alles löschen 
  * ![](/img/tutor/newItem.png) Neues Workflow Element 


#### Flow

Bei Ihrem ersten Besuch möchten Sie möglicherweise mit einer Beispielgeschichte von der Story-Seite beginnen. Laden Sie eine Geschichte auf Ihren Computer herunter und laden Sie sie mit der Symbolleiste hochladen in den Workspace hoch.

So sieht der Flow von Geschichte 1 aus: ![](/stories/story1.png)

Sie können das Beispiel überprüfen und ändern oder einen vollständig neuen Flow starten. (Klicken Sie auf *Löschen* für einen Neuanfang.)

Wählen Sie Elemente aus der Symbolleiste Neues Element. Das Element wird im Flow-Bereich angezeigt.
Klicken und ziehen Sie Elemente herum.

Ziehen Sie den Hintergrund, um die Ansicht zu bewegen. Verwenden Sie die Mausrad-Steuerung oder Touch-Gesten zum Vergrößern und Verkleinern.

Langes Klicken auf ein Element öffnet das Kontextmenü. Optionen werden sein:

  * Konfigurieren
  * Verbinden
  * Löschen

![](/img/tutor/node-long-click.png)


Nicht alle Optionen sind für alle Elemente verfügbar.

Die tatsächlichen Konfigurationsoptionen hängen vom Knotentyp ab, zum Beispiel der Zufallsgenerator

![](/img/tutor/node-config.png)


Sie können zuerst verbinden oder zuerst konfigurieren, es spielt keine Rolle.

Klicken Sie auf Verbinden, um eine Verbindung zu starten. Bewegen Sie die Maus ein Stück weg vom Quellknoten. Eine Verbindungsleitung sollte erscheinen.

![](/img/tutor/edge-connect-in-progress.png)


Bewegen Sie sich zum Zielknoten und klicken Sie darauf.

Es wird möglicherweise nach dem zu verbindenden Port gefragt. Wählen Sie A oder B

![](/img/tutor/edge-connect-final.png)

Wenn Sie fertig sind, sehen Sie eine neue Verbindung

![](/img/tutor/edge-connect-finish.png)

Wenn Sie ein Visualisierungselement (eines der *Plot*-Elemente) hinzufügen, wird es dem Visualisierungsbereich hinzugefügt.
Sie können Flow-Elemente und Visualisierungs-Elemente anhand ihrer Namen abgleichen.

Ein sehr kleiner Flow mit zwei Ausgabe-Elementen würde zum Beispiel so aussehen:

![](/img/tutor/miniflow.png)

![](/img/tutor/chartplot.png)

![](/img/tutor/tableplot.png)


Scrollen Sie im Visualisierungsfenster, um alle Diagramme zu sehen.

 * Klicken Sie ![](/img/tutor/editStory.png) um eine Beschreibung für Ihre GEschichte anzulegen
 * Ihren Workflow mit Geschichte können Sie hier herunterladen: ![](/img/tutor/download.png). In der Datei sind alle Information enthalten und Sie können Sie mit anderen austauschen, z.B. per EMail. Und wir sammeln auch interessante Geschichten. 
* Schauen SIe auf der Seite mit den Geschichten nach: ![](/img/tutor/stories.png)




### Fortgeschritten

<img src="/img/tutor/advanced.png" class="large">

Ein paar Ideen, was für Dich interessant sein könnte, wenn Du Dich schon mit ein paar Datengeschichten vergnügt hast.

### Zugang

<img src="/img/tutor/account.png" class="large">

Normalerweise müssen Sie sich nicht anmelden, um die **Daten.Cafe** Anwendung zu verwenden.

#### **ABER !!!** 

Es gibt ein grundlegendes Problem mit allen browserbasierten Datentools

**CORS: Cross-Origin-Resource-Sharing**

Die Erklärung

  * Sie greifen auf diese Anwendung über https://daten.cafe zu
  * Sie erstellen einen Workflow, der einige Daten abrufen möchte, z.B. von https://transparenz.karlsruhe.de/dataset/cc50eb96-6c3d-4d6f-9dcd-c56c4969ff59/resource/ea8303b4-0494-4f95-b624-f695753d1a2c/download/altersstruktur-der-bevolkerung-65-bis-unter-75-jahrige-nach-geschlecht.csv
  * Diese Daten werden auf einem sogenannten "Open-Data-Portal" aufbewahrt und sollten daher für jeden frei zugänglich sein.
  * Ihr Browser (Firefox, Safari, Chrome, was auch immer) erkennt nun, dass dies eine andere Domäne ist als die, von der aus Sie die Anwendung geladen haben.
  * Diese Tatsache löst den CORS-Mechanismus aus:
  * * Anstatt nur zu sagen: "Hey, gib mir die Daten", sagt Ihr Browser "Hallo, ich bin Daten.Cafe und ich möchte wissen, ob Sie mir die Daten geben würden, wenn ich danach fragen würde". Leider verstehen viele Server höfliche Fragen nicht. Als Ergebnis bekommen wir keinen Zugang, obwohl der Server durchaus bereit ist, seine Daten jedem zur Verfügung zu stellen - vorausgesetzt er stellt keine langen Fragen.
  * Es gibt 2 Lösungen, um dieses Problem zu umgehen:
  * * Verwenden eines CORS-Proxy-Servers. Das bedeutet, dass wir unsere Anfrage an einen anderen Server senden, mit dem wir gut befreundet sind, und ihn bitten, die Daten für uns zu besorgen. Dies kann im Hintergrund geschehen - vorausgesetzt, Sie sind gut mit dem Proxy-Server befreundet. Und dafür benötigen Sie das Konto und die Anmeldung. Normalerweise bieten wir die Registrierung an, sobald Sie einen Workshop bei uns gemacht haben.
  * * Wir können den Browser zwingen, die angeforderte Datei lokal auf Ihrem Rechner herunterzuladen (übrigens genau das, was passiert, wenn Sie auf den obigen Link klicken). Sobald dies erledigt ist, können Sie die Datei in Ihren Workflow hochladen. Dies ist weniger bequem, da es manuelle Interaktionen von Ihnen erfordert (Herunterladen der Datei und Hochladen der Datei). Aber andererseits können Sie tun, was Sie wollen, und Daten.Cafe ist in erster Linie ein Bildungswerkzeug, keine High-End-Datenwissenschaftsanwendung. Also sind Sie so oder so gut aufgehoben.

CORS ist grundsätzlich eine gute Funktion. Es ist nur so, dass viele Server nicht darauf vorbereitet sind, "höfliche" Datenanfragen von Browsern zu erhalten. Das wurde früher nicht gemacht...


