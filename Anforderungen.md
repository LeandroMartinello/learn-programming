# Anforderungen: Launcher und Vollbild-Spielmodus

## 1. Ziel
- Die Anwendung soll einen klar getrennten Launcher und einen getrennten Spielmodus besitzen.
- Im Spielmodus soll das ausgewählte Spiel die gesamte Browseransicht nutzen.

## 2. Launcher-Anforderungen
- Der Launcher ist die Startansicht.
- Der Launcher zeigt eine auswählbare Liste von Spielen.
- Jeder Listeneintrag enthält:
  - ein Vorschaubild/Thumbnail links,
  - Titel und Kurzbeschreibung,
  - eine klare Aktion zum Starten.
- Beim Start eines Spiels wird der Launcher ausgeblendet.

## 3. Spielmodus-Anforderungen
- Der Spielmodus läuft als eigene Ansicht getrennt vom Launcher.
- Pro Zeitpunkt ist genau ein Spiel aktiv sichtbar.
- Eine klare „Zurück zum Launcher“-Funktion muss vorhanden sein.
- Das aktive Spiel soll die verfügbare Browserhöhe und -breite nutzen.

## 4. Layout- und Responsiveness-Anforderungen
- Die UI muss ohne Seiten-Scrollen nutzbar sein.
- Die Root-Ansicht soll auf Viewport-Höhe ausgelegt sein (z. B. 100vh/100%).
- Spielbereiche (Canvas, Panels, Controls) müssen sich responsiv anpassen.
- Wichtige Bedienfunktionen müssen auf kleineren Viewports erreichbar bleiben.

## 5. Spielspezifische Anforderungen
- Snake:
  - Spielbrett gut sichtbar und skaliert,
  - Score/Status sichtbar,
  - Pause/Neustart erreichbar.
- Leander's Abenteuer:
  - Szene sichtbar mit Interaktionsmöglichkeiten,
  - zentrale HUD-Elemente sichtbar (Ziel, Verben/Aktionen, Inventar, Log),
  - Steuerung ohne Seiten-Scrollen möglich.

## 6. Technische Anforderungen
- Umsetzung mit React + TypeScript auf Vite.
- Keine unnötigen zusätzlichen Libraries.
- Bestehende Spiellogik soll funktionsfähig bleiben.
- Änderungen sollen klar strukturiert und wartbar sein.

## 7. Lokalisierung
- Deutsch ist die Standardsprache der Anwendung.
- Es muss eine Sprachauswahl (Combobox) auf der Launcher-Seite geben.
- Mindestens Deutsch und Englisch werden unterstützt.
- Zentrale UI-Texte in Launcher und Spielen müssen lokalisiert sein.

## 8. Asset- und Szenenanforderungen (Adventure)
- Das Szenenbild für Außenbereich ist `Spukhaus_Außen.png`.
- Das Szenenbild soll den Canvas-Bereich visuell überlappen (kein harter Kasten-Look).
- Für Leander wird `Walking_Leander_10x10.png` als Sprite-Sheet verwendet.
- Für Noemi wird `Walking_Noemi_10x10_2.png` als Sprite-Sheet verwendet.
- Color-Key `#18fdfe` muss transparent verarbeitet werden.

## 9. Bewegungs- und Animationsanforderungen (Adventure)
- Charaktere dürfen bei Klick nicht teleportieren, sondern müssen zum Ziel laufen.
- Beide Charaktere bleiben gleichzeitig sichtbar.
- Es bewegt sich immer der aktuell aktive/selektierte Charakter.
- Bewegungsanimationen laufen zyklisch pro Richtung.
- Richtungszuordnung Leander:
  - Zeile 1: rechts
  - Zeile 2: links
  - Zeile 3: hinten
  - Zeile 4: vorn
  - Zeile 5: diagonal rechts-vorn
  - Zeile 6: diagonal links-vorn
  - Zeile 7–8: Reaktionen
- Richtungszuordnung Noemi:
  - Zeile 1: rechts
  - Zeile 2: links
  - Zeile 3: hinten
  - Zeile 4: vorn
  - Zeile 5: diagonal links-vorn
  - Zeile 6: diagonal rechts-vorn
  - Zeile 7: diagonal links-hinten
  - Zeile 8: diagonal rechts-hinten
  - Zeile 9–10: Reaktionen

## 10. Interaktion und Kamera (Adventure)
- Hotspot-Rahmen sollen nicht dauerhaft sichtbar sein.
- Titel von Szenen-Items/Hotspots werden nur bei Hover angezeigt.
- Die Szene soll horizontal mit einer Kamera folgen:
  - Wenn der aktive Charakter in den 20%-Randbereich links/rechts kommt,
    verschiebt sich die Szene horizontal.
