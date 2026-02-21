# learn-programming
leander learns to code computer games

## Snake (classic)

### Start
1. Start a local static server from this folder:
   ```bash
   python3 -m http.server 8000
   ```
2. Open:
   `http://localhost:8000/index.html`

### Controls
- Keyboard: Arrow keys or `WASD`
- Pause/Resume: `Space` or `Pause` button
- Restart: `Restart` button
- Mobile/on-screen: `Up`, `Down`, `Left`, `Right` buttons

### Tests
Run core logic tests:
```bash
node --test tests/snakeLogic.test.js
```

### Manual verification checklist
- Controls:
  - Arrow keys and `WASD` move the snake
  - Opposite-direction instant reversal is blocked
- Pause/Restart:
  - `Space` toggles pause/resume
  - `Restart` starts a fresh game and resets score
- Boundaries and collisions:
  - Wall collision triggers game over
  - Self-collision triggers game over
  - Eating food increases score and snake length
