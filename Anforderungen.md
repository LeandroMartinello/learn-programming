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
