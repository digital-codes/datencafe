https://de.wikipedia.org/wiki/Datenmodellierung

Beispiele für Datenmodelle sind etwa:

    Produkt, Kunde, Auftrag und Rechnung als „Objekttypen“ (Entitätstypen) in einem zu erstellenden oder zu beschaffenden Auftragsabwicklungssystem eines mittelständischen Handelsunternehmens aus der Sicht des Vertriebs. Das Modell dieses Realitätsausschnittes kann dazu dienen, die Spezifikation der funktionellen Anforderungen an das System vorzunehmen.
    Das Metamodell des in einem Forschungsbereich verwendeten Thesaurus, also die spezifische Terminologie mit ihren Synonyma und Unter- und Oberbegriffen sowie verwandten Begriffen als Nachschlagewerk für die in diesem Bereich arbeitenden Forscher. Für die Darstellung des resultierenden Datenmodells kann zum Beispiel eine Topic Map verwendet werden. Das Metamodell für diesen Thesaurus kann dazu dienen, eine Datenbank (ggf. inkl. IT-Anwendung) für die Erfassung der genannten Begriffe zu schaffen.
    Das semantische Datenmodell für eine Projektmanagement-Anwendung zur Auftragsverwaltung – wie in der Grafik 1 dargestellt.
    Das Datenbankschema als Grafik aus dem Implementierungswerkzeug MS Access für dieselbe Projektmanagement-Anwendung – Grafik 2 mit implementierungstechnischen Erweiterungen bzw. Abweichungen vom semantischen Modell. Ein Datenbankmodell als Zwischenstufe wurde hier nicht getrennt erstellt.

Es wird deutlich, dass die Relevanz des Realitätsausschnittes durch den jeweiligen Kontext und den spezifischen Zweck bestimmt wird. 


https://de.wikipedia.org/wiki/Datenbankmodell



https://de.wikipedia.org/wiki/Relationale_Datenbank


Grundlegende Konzepte
Begriffe relationaler Datenbanken

Eine relationale Datenbank kann man sich als eine Sammlung von Tabellen (den Relationen) vorstellen, in welchen Datensätze abgespeichert sind. Jede Zeile (Tupel) in einer Tabelle ist ein Datensatz (record). Jedes Tupel besteht aus einer Reihe von Attributwerten (Attribute = Eigenschaften), den Spalten der Tabelle. Das Relationenschema legt dabei die Anzahl und den Typ der Attribute für eine Relation fest. Das Bild illustriert die Relation R mit Attributen A1 bis An in den Spalten.

Zum Beispiel wird ein Buch in einer Bibliothek durch den Datensatz (Buch-ID, Autor, Verlag, Verlagsjahr, Titel, Datum der Aufnahme) beschrieben. Ein Datensatz muss eindeutig identifizierbar sein. Das geschieht über einen oder mehrere Schlüssel (englisch key). In diesem Fall enthält Buch-ID die Schlüssel. Ein Schlüssel darf sich niemals ändern. Er bezieht sich auf den Datensatz und nicht auf die Position in der Tabelle.
Beispiel einer Relation „Buch“: Buch-ID 	Autor 	Verlag 	Verlagsjahr 	Titel 	Datum
1 	Hans Vielschreiber 	Musterverlag 	2007 	Wir lernen SQL 	13.01.2007
2 	J. Gutenberg 	Gutenberg und Co. 	1452 	Drucken leicht gemacht 	01.01.1452
3 	G. I. Caesar 	Handschriftverlag 	−44 	Mein Leben mit Asterix 	16.03.−44
5 	Galileo Galilei 	Inquisition International 	1640 	Eppur si muove 	1641
6 	Charles Darwin 	Vatikan-Verlag 	1860 	Adam und Eva 	1862
Beziehungen zwischen Tabellen

Weiterhin können Verknüpfungen genutzt werden, um die Beziehungen zwischen Tabellen auszudrücken. Eine Bibliothekdatenbank könnte damit etwa folgendermaßen mit drei Tabellen implementiert werden:

Tabelle Buch, die für jedes Buch eine Zeile enthält:

    Jede Zeile besteht aus den Spalten der Tabelle (Attributen): Buch-ID, Autor, Verlag, Verlagsjahr, Titel, Datum der Aufnahme.
    Als Schlüssel dient die Buch-ID, da sie jedes Buch eindeutig identifiziert.

Tabelle Nutzer, die die Daten von allen registrierten Bibliotheksnutzern enthält:

    Die Attribute wären zum Beispiel: Nutzer-ID, Vorname, Nachname.


Außerdem braucht man eine dritte Tabelle Entliehen, die Informationen über die Verfügbarkeit des Buches enthält. Sie würde die Attribute Nutzer-ID und Buch-ID enthalten. Jede Zeile dieser Tabelle Entliehen ordnet einer Nutzer-ID eine Buch-ID zu.

Der Eintrag (10,3) würde also heißen, dass der Nutzer mit der ID 10 („Hans Vielleser“) das Buch mit der ID 3 („Mein Leben mit Asterix“) entliehen hat. Derselbe Nutzer hat auch das Buch „Drucken leicht gemacht“ entliehen, was durch den Tabelleneintrag (10,2) belegt ist. Als Schlüssel nimmt man hier die Attributmenge (Nutzer-ID, Buch-ID). Gleichzeitig verbindet die Nutzer-ID jeden Eintrag der Tabelle Entliehen mit einem Eintrag der Tabelle Nutzer, sowie die Buch-ID jeden Eintrag von Entliehen mit einem Eintrag der Tabelle Buch. Deswegen heißen diese Attribute in diesem Zusammenhang Fremdschlüssel (englisch foreign key). Tabellen ohne Fremdschlüssel nennt man flache Tabellen.

Der hier benutzte Begriff Relation beschreibt nicht die Beziehung zwischen Entitäten (wie im Entity-Relationship-Modell), sondern die Beziehung der Attribute zum Relationennamen. So gilt im obigen Beispiel: Hans ist Vorname (Attribut) von Nutzer (Relationenname). Außerdem wird Relation bei relationalen Datenbanken allgemein als Synonym für Tabelle genutzt (meist aus Entitätstyp im ERM entstehend).


https://www.ibm.com/de-de/topics/data-modeling


Bei der Datenmodellierung wird ein ganzes Informationssystem oder Teile davon visuell dargestellt, um Verbindungen zwischen Datenpunkten und -strukturen zu verdeutlichen. Ziel ist es, die im System verwendeten und gespeicherten Datentypen, die Beziehungen zwischen diesen Datentypen, die Art und Weise, wie die Daten gruppiert und organisiert werden können, sowie ihre Formate und Attribute zu veranschaulichen.

Datenmodelle basieren auf den Geschäftsanforderungen. Regeln und Anforderungen werden im Vorfeld durch Rückmeldungen von verschiedenen Beteiligten definiert, damit sie in den Entwurf eines neuen Systems einfließen oder bei der Iteration eines bestehenden Systems angepasst werden können.

Daten können auf verschiedenen Abstraktionsebenen modelliert werden. Der Prozess beginnt mit dem Sammeln von Informationen über die Geschäftsanforderungen verschiedener Interessengruppen und Endbenutzer. Diese Geschäftsregeln werden dann in Datenstrukturen übersetzt, um einen konkreten Datenbankentwurf zu formulieren. Ein Datenmodell ist vergleichbar mit einer Roadmap, dem Entwurf eines Architekten oder einem anderen formalen Diagramm, das ein tieferes Verständnis von dem ermöglicht, was entworfen werden soll.

Bei der Datenmodellierung werden standardisierte Schemata und formale Techniken verwendet. Dies ermöglicht eine einheitliche, konsistente und vorhersehbare Art der Definition und Verwaltung von Datenressourcen im gesamten Unternehmen oder sogar darüber hinaus.

Im Idealfall handelt es sich bei Datenmodellen um dynamische Dokumente, die sich mit den sich ändernden Geschäftsanforderungen weiterentwickeln. Sie spielen eine wichtige Rolle bei der Unterstützung der Geschäftsprozesse und der Planung der IT-Architektur und -Strategie. Datenmodelle können mit Lieferanten, Partnern und/oder anderen Unternehmen der Branche ausgetauscht werden



Wie jeder Entwurfsprozess beginnt auch der Entwurf von Datenbanken und Informationssystemen auf einer hohen Abstraktionsebene und wird zunehmend konkreter und spezifischer. Datenmodelle können im Allgemeinen in drei Kategorien eingeteilt werden, die sich nach ihrem Abstraktionsgrad unterscheiden. Der Prozess beginnt mit einem konzeptionellen Modell, geht über zu einem logischen Modell und endet mit einem physischen Modell. Die verschiedenen Arten von Datenmodellen werden im Folgenden näher erläutert:

    Konzeptuelle Datenmodelle. Sie werden auch als Domänenmodelle bezeichnet und bieten einen Überblick darüber, was das System enthalten soll, wie es organisiert sein soll und welche Geschäftsregeln beteiligt sind. Konzeptuelle Modelle werden in der Regel als Teil des Prozesses zur Erfassung der ersten Projektanforderungen erstellt. Sie umfassen in der Regel Entitätsklassen (die die Arten von Dingen definieren, die für das Unternehmen wichtig sind und im Datenmodell dargestellt werden müssen), ihre Merkmale und Einschränkungen, die Beziehungen zwischen ihnen und die relevanten Sicherheits- und Datenintegritätsanforderungen. Die Notation ist in der Regel einfach.

     
    Logische Datenmodelle. Sie sind weniger abstrakt und liefern detailliertere Informationen über die Konzepte und Beziehungen in dem betrachteten Bereich. Es wird eines von mehreren formalen Notationssystemen für die Datenmodellierung verwendet. Diese geben Datenattribute an, wie z. B. Datentypen und ihre entsprechenden Längen, und zeigen die Beziehungen zwischen den Entitäten. Logische Datenmodelle spezifizieren keine technischen Systemanforderungen. Diese Phase wird bei agilen oder  DevOps -Verfahren häufig ausgelassen. Logische Datenmodelle können in stark prozeduralen Implementierungsumgebungen oder bei Projekten, die von Natur aus datenorientiert sind, wie z. B.  Data-Warehouse-Design  oder Entwicklung von Berichtssystemen, nützlich sein.

     
    Physische Datenmodelle. Sie stellen ein Schema für die physische Speicherung der Daten in einer Datenbank bereit. Als solche sind diese Modelle die am wenigsten abstrakten von allen. Sie bieten ein fertiges Design, das als relationale Datenbank implementiert werden kann, einschließlich assoziativer Tabellen, die die Beziehungen zwischen den Entitäten sowie die Primär- und Fremdschlüssel, die zur Aufrechterhaltung dieser Beziehungen verwendet werden, veranschaulichen. Physische Datenmodelle können DBMS-spezifische Eigenschaften enthalten, einschließlich Leistungsoptimierung.






Bei der Datenmodellierung sind die Beteiligten gefordert, die Datenverarbeitung und -speicherung bis ins kleinste Detail zu bewerten. Für Datenmodellierungstechniken gibt es verschiedene Konventionen, die vorschreiben, welche Symbole zur Darstellung der Daten verwendet werden, wie die Modelle aufgebaut sind und wie die Geschäftsanforderungen übermittelt werden. Alle Ansätze bieten formalisierte Arbeitsabläufe, die eine Abfolge von Aufgaben beinhalten, die iterativ durchgeführt werden. Diese Arbeitsabläufe sehen in der Regel wie folgt aus:

    Identifizieren der Entitäten. Der Prozess der Datenmodellierung beginnt mit der Identifizierung der Dinge, Ereignisse oder Konzepte, die in den zu modellierenden Daten enthalten sind. Jede Entität sollte kohärent und logisch von allen anderen getrennt sein.
    Identifizieren der Schlüsseleigenschaften jeder Entität. Jeder Entitätstyp kann von allen anderen unterschieden werden, weil er eine oder mehrere eindeutige Eigenschaften hat, die als Attribute bezeichnet werden. Eine Entität mit der Bezeichnung „Kunde“ könnte beispielsweise Attribute wie Vorname, Nachname, Telefonnummer und Anrede enthalten, während eine Entität mit der Bezeichnung „Adresse“ einen Straßennamen und eine Hausnummer, einen Ort, ein Bundesland, ein Land und eine Postleitzahl umfassen könnte.
    Beziehungen zwischen den Entitäten identifizieren. Im ersten Entwurf eines Datenmodells wird die Art der Beziehungen jeder Entität zu den anderen festgelegt. Im obigen Beispiel „wohnt“ jeder Kunde an einer Adresse. Würde dieses Modell um eine Entität namens „Bestellungen“ erweitert, würde jede Bestellung auch an eine Adresse versandt und in Rechnung gestellt. Diese Beziehungen werden in der Regel mit der Unified Modeling Language (UML) dokumentiert.
    Attribute vollständig den Entitäten zuordnen. Auf diese Weise wird sichergestellt, dass das Modell widerspiegelt, wie das Unternehmen die Daten nutzen wird. Es gibt mehrere formale Datenmodellierungsmuster, die weit verbreitet sind. Objektorientierte Entwickler wenden häufig Analyse- oder Entwurfsmuster an, während Beteiligte aus anderen Geschäftsbereichen möglicherweise andere Muster verwenden.
    Die Schlüssel nach Bedarf zuweisen und einen Normalisierungsgrad festlegen, der ein ausgewogenes Verhältnis zwischen der Notwendigkeit, Redundanz zu vermeiden, und den Leistungsanforderungen herstellt. Normalisierung ist eine Technik zur Organisation von Datenmodellen (und den Datenbanken, die sie darstellen), bei der numerische Bezeichner, sogenannte Schlüssel, Datengruppen zugewiesen werden, um Beziehungen zwischen ihnen darzustellen, ohne die Daten zu wiederholen. Wenn beispielsweise jedem Kunden ein Schlüssel zugewiesen wird, kann dieser Schlüssel sowohl mit seiner Adresse als auch mit seiner Bestellhistorie verknüpft werden, ohne dass diese Informationen in der Tabelle mit den Kundennamen wiederholt werden müssen. Durch die Normalisierung wird in der Regel der Speicherplatzbedarf einer Datenbank verringert, was jedoch zu Lasten der Abfrageleistung gehen kann.
    Datenmodell fertigstellen und validieren. Die Datenmodellierung ist ein iterativer Prozess, der wiederholt und verfeinert werden muss, wenn sich die Geschäftsanforderungen ändern.





Die Datenmodellierung hat sich parallel zu den Datenbankmanagementsystemen entwickelt, wobei die Modelltypen mit dem wachsenden Datenspeicherbedarf der Unternehmen immer komplexer wurden. Im Folgenden sind verschiedene Arten von Modellen aufgeführt:

    Hierarchische Datenmodelle stellen Eins-zu-viele-Beziehungen in einem baumartigen Format dar. Bei diesem Modelltyp hat jeder Datensatz eine einzige Stamm- oder übergeordnete Tabelle, die einer oder mehreren untergeordneten Tabellen zugeordnet ist. Dieses Modell wurde im IBM Information Management System (IMS) implementiert, das im Jahr 1966 eingeführt wurde und schnell weite Verbreitung fand, insbesondere im Bankwesen. Dieser Ansatz ist zwar weniger effizient als neuere Datenbankmodelle, wird aber immer noch in XML-Systemen (Extensible Markup Language) und geografischen Informationssystemen (GIS) verwendet.
    Relationale Datenmodelle wurden ursprünglich von dem IBM Forscher E. F. Codd im Jahr 1970 vorgeschlagen. Sie sind auch heute noch in den vielen verschiedenen relationalen Datenbanken implementiert, die in Unternehmen eingesetzt werden. Für die relationale Datenmodellierung ist kein detailliertes Verständnis der physikalischen Eigenschaften der verwendeten Datenspeicher erforderlich. Datensegmente werden explizit durch die Verwendung von Tabellen verknüpft, was die Komplexität der Datenbank reduziert.

Relationale Datenbanken verwenden häufig eine strukturierte Abfragesprache (SQL) für das Datenmanagement. Diese Datenbanken eignen sich gut zur Erhaltung der Datenintegrität und zur Minimierung der Redundanz. Sie werden häufig in Kassensystemen und für andere Arten der Transaktionsverarbeitung eingesetzt.

    Entity-Relationship-Datenmodelle (ER) verwenden formale Diagramme, um die Beziehungen zwischen Entitäten in einer Datenbank darzustellen. Datenarchitekten verwenden verschiedene ER-Modellierungstools, um Übersichten/Grafiken zu erstellen, die die Ziele des Datenbankdesigns vermitteln.
    Objektorientierte Datenmodelle wurden Mitte der 1990er Jahre durch die objektorientierte Programmierung bekannt und fanden großen Anklang. Bei den „Objekten“ handelt es sich um Abstraktionen von realen Entitäten. Objekte werden in Klassenhierarchien gruppiert und haben zugehörige Merkmale. Objektorientierte Datenbanken können Tabellen enthalten, können aber auch komplexere Datenbeziehungen unterstützen. Dieser Ansatz wird in Multimedia- und Hypertext-Datenbanken sowie für andere Anwendungsfälle eingesetzt.
    Dimensionale Datenmodelle wurden von Ralph Kimball entwickelt, um die Geschwindigkeit des Datenabrufs für analytische Zwecke in einem Data Warehouse zu optimieren. Während bei relationalen und ER-Modellen die effiziente Speicherung im Vordergrund steht, wird bei dimensionalen Modellen die Redundanz erhöht, um das Auffinden von Informationen für Berichte und Abfragen zu erleichtern. Diese Modellierung wird typischerweise in OLAP-Systemen verwendet.

Zwei beliebte dimensionale Datenmodelle sind zum einen das Sternschema, bei dem die Daten in Fakten (messbare Elemente) und Dimensionen (Referenzinformationen) gegliedert sind, wobei jeder Fakt sternförmig von den zugehörigen Dimensionen umgeben ist. Das andere ist das Schneeflockenschema, das dem Sternschema ähnelt, aber zusätzliche Schichten von assoziierten Dimensionen enthält, wodurch das Verzweigungsmuster komplexer wird.



Die Datenmodellierung erleichtert es Entwicklern, Datenarchitekten, Geschäftsanalysten und anderen Beteiligten, die Beziehungen zwischen den Daten in einer Datenbank oder einem Data-Warehouse sichtbar und verständlich zu machen. Darüber hinaus bietet die Modellierung folgende Möglichkeiten:

    Reduzieren von Fehlern in der Software- und Datenbankentwicklung.
    Verbesserte Konsistenz in Dokumentation und Systemdesign im gesamten Unternehmen.
    Verbesserung der Anwendungs- und Datenbankleistung.
    Vereinfachung der Datenzuordnung im gesamten Unternehmen.
    Verbesserte Kommunikation zwischen Entwickler- und Business-Intelligence-Teams.
    Vereinfachter und beschleunigter Datenbankdesignprozess auf der konzeptuellen, logischen und physischen Ebene.

Tools für die Datenmodellierung

Zahlreiche kommerzielle und Open-Source-Lösungen für Computer-Aided Software Engineering (CASE) sind heute im Umlauf, darunter mehrere Tools für Datenmodellierung, Diagrammerstellung und Visualisierung. Im Folgenden sind einige Beispiele aufgeführt:

    erwin Data Modeler ist ein Datenmodellierungstool, das auf der Datenmodellierungssprache Integration DEFinition for Information Modeling (IDEF1X) basiert und nun auch andere Notationsmethoden, einschließlich eines dimensionalen Ansatzes, unterstützt.
    Enterprise Architect ist ein visuelles Modellierungs- und Design-Tool, das die Modellierung von Informationssystemen und Architekturen von Unternehmen sowie von Softwareanwendungen und Datenbanken unterstützt. Es basiert auf objektorientierten Sprachen und Standards.
    ER/Studio ist eine Software für den Datenbankentwurf, die mit mehreren der gängigsten Datenbankmanagementsysteme kompatibel ist. Es unterstützt sowohl relationale als auch dimensionale Datenmodellierung.
    Kostenlose Datenmodellierungstools wie z. B. die Open-Source-Lösung Open ModelSphere.





