# Specification

## Summary
**Goal:** Rename the game to “Neon Doge” across the UI, fix multiplier scoring behavior (including blue ball reset), and correct fullscreen/responsive height compression so gameplay displays consistently.

**Planned changes:**
- Update all user-visible title text to “Neon Doge”, including the HTML document title and landing screen header/hero text (and any related alt text).
- Correct the multiplier logic so it reliably affects scoring and is managed in game state; display the live multiplier value in the HUD and keep it consistent through pause/resume.
- On collision with the blue ball power-up, reset the multiplier to its base value immediately (same tick the collision is processed).
- Fix fullscreen/responsive sizing so the gameplay view maintains stable, consistent vertical height across view widths (mobile/desktop), uses visual viewport sizing when available, and keeps HUD overlays correctly positioned after resize/fullscreen changes.

**User-visible outcome:** The game appears as “Neon Doge” everywhere, scoring clearly reflects the active multiplier shown in the HUD (with blue ball resetting it instantly), and fullscreen/mobile gameplay no longer looks vertically compressed.
