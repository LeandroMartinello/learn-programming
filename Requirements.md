# Anforderungen: Klassisches Snake-Spiel

## 1. Ziel
Ein kleines, klassisches Snake-Spiel soll im bestehenden Repository umgesetzt werden.

## 2. Funktionsumfang (verpflichtend)
- Das Spiel läuft auf einem festen Raster (Grid).
- Die Schlange bewegt sich in diskreten Schritten (Tick-basiert), nicht kontinuierlich.
- Richtungssteuerung per Tastatur:
  - Pfeiltasten
  - alternativ WASD
- Die Schlange wächst genau dann, wenn Futter eingesammelt wird.
- Futter erscheint auf einer freien Rasterzelle (nicht auf der Schlange).
- Ein Punktestand (Score) zählt eingesammeltes Futter.
- Game-Over tritt ein bei:
  - Kollision mit der Wand (Grenzen des Spielfelds)
  - Kollision mit dem eigenen Körper
- Neustart nach Game-Over muss möglich sein.
- Der Kern-Gameplay-Loop ist strikt „classic Snake“:
  - Bewegung
  - Wachstum
  - Futter-Spawn
  - Score
  - Game-Over
  - Restart

## 3. Scope- und Architekturvorgaben
- Es dürfen nur bestehende Projekt-Tooling-/Framework-Konventionen genutzt werden.
- Es sollen keine neuen Dependencies hinzugefügt werden, außer wenn technisch zwingend erforderlich.
- Die Implementierung soll klein, klar benannt und leicht nachvollziehbar sein.
- Spiellogik soll deterministisch und testbar aufgebaut sein (reine Funktionen wo sinnvoll).

## 4. UI/UX-Vorgaben
- UI minimal halten, ohne neues Design-System.
- Keine zusätzlichen Animationen oder komplexen Effekte.
- Einfache Darstellung von:
  - Spielfeld (Grid)
  - Schlange
  - Futter
  - Score
  - Status (laufend / Game-Over)
- Falls mobiles Bedienkonzept bereits im Repo vorhanden ist, sollen On-Screen-Controls unterstützt werden.

## 5. Qualitätsanforderungen
- Kernlogik soll durch Basistests abgedeckt werden, sofern ein Test-Runner im Projekt verfügbar ist.
- Zu testen sind mindestens:
  - Bewegung
  - Kollisionen
  - Wachstum
  - Futter-Platzierung
- Code soll klar strukturiert und wartbar sein.

## 6. Lieferumfang
- Eine kleine, klar abgegrenzte Menge an Dateien/Änderungen.
- Kurze Ausführungsanleitung:
  - Dev-Server starten
  - Zielseite/Route öffnen
- Kurze manuelle Test-Checkliste für:
  - Steuerung
  - Pause/Neustart
  - Grenzen/Kollisionen
