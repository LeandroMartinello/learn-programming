# learn-programming
leander learns to code computer games

## Vite + React + TypeScript Game Hub

### Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the Vite dev server:
   ```bash
   npm run dev
   ```
3. Open the local URL shown by Vite (typically `http://localhost:5173`).
4. In the launcher page, select:
   - `Snake`
   - `Leander's Abenteuer`
5. Optional avatars for adventure:
   - add `public/avatars/leander.png`
   - add `public/avatars/noemi.png`

### Controls
- Keyboard: Arrow keys or `WASD`
- Pause/Resume: `Space` or `Pause` button
- Restart: `Restart` button
- Mobile/on-screen: `Up`, `Down`, `Left`, `Right` buttons

### Adventure controls
- Click verbs (`LOOK`, `TALK`, `TAKE`, `USE`)
- Click hotspots in list or directly on the scene canvas
- Use travel buttons to move between locations
- Switch active scout (Leander/Noemi) from the scout cards

### Tests
Run core logic tests:
```bash
npm test
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
