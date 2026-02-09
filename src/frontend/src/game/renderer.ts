import type { GameState, InputState } from './gameTypes';
import { getRendererAssets } from './rendererAssets';

// Parallax layer configuration
interface ParallaxLayer {
  offsetX: number;
  offsetY: number;
  scale: number;
}

const parallaxState: ParallaxLayer = {
  offsetX: 0,
  offsetY: 0,
  scale: 1.1,
};

export function renderGame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gameState: GameState,
  inputState: InputState,
  reducedMotion: boolean
) {
  const assets = getRendererAssets();

  // Apply screen shake
  ctx.save();
  if (!reducedMotion && gameState.shake > 0) {
    const shakeX = (Math.random() - 0.5) * gameState.shake * 20;
    const shakeY = (Math.random() - 0.5) * gameState.shake * 20;
    ctx.translate(shakeX, shakeY);
  }

  // Update parallax based on player position (only if reduced motion is off)
  if (!reducedMotion) {
    const targetOffsetX = (gameState.player.x - 0.5) * 0.05;
    const targetOffsetY = (gameState.player.y - 0.5) * 0.05;
    parallaxState.offsetX += (targetOffsetX - parallaxState.offsetX) * 0.1;
    parallaxState.offsetY += (targetOffsetY - parallaxState.offsetY) * 0.1;
  }

  // Draw layered/parallax background
  if (assets.background && assets.background.complete) {
    const bgWidth = width * parallaxState.scale;
    const bgHeight = height * parallaxState.scale;
    const bgX = (width - bgWidth) / 2 + parallaxState.offsetX * width;
    const bgY = (height - bgHeight) / 2 + parallaxState.offsetY * height;
    
    ctx.drawImage(assets.background, bgX, bgY, bgWidth, bgHeight);
  } else {
    // Fallback swampy gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a2e1a');
    gradient.addColorStop(0.5, '#0f1f0f');
    gradient.addColorStop(1, '#0a150a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  // Add atmospheric vignette overlay
  const vignetteGradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.3,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.8
  );
  vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
  ctx.fillStyle = vignetteGradient;
  ctx.fillRect(0, 0, width, height);

  // Update player position smoothly
  gameState.player.x += (inputState.targetX - gameState.player.x) * 0.15;
  gameState.player.y += (inputState.targetY - gameState.player.y) * 0.15;

  // Draw particles with enhanced attributes
  gameState.particles.forEach((particle) => {
    const particleSize = particle.size * width * (0.5 + particle.life * 0.5);
    ctx.save();
    ctx.globalAlpha = particle.life * 0.8;
    ctx.fillStyle = particle.color;
    ctx.shadowBlur = 15 * particle.life;
    ctx.shadowColor = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x * width, particle.y * height, particleSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Draw power-ups (tokens) with enhanced sprite rendering
  gameState.powerUps.forEach((powerUp) => {
    const x = powerUp.x * width;
    const y = powerUp.y * height;
    const size = powerUp.size * width;

    ctx.save();
    
    // Pulsing glow effect
    const pulseScale = 1 + Math.sin(Date.now() * 0.005) * 0.1;
    ctx.shadowBlur = 30 * pulseScale;
    ctx.shadowColor = 'oklch(0.78 0.24 75)';

    if (assets.token && assets.token.complete) {
      // Enhanced sprite rendering with lighting
      ctx.globalAlpha = 0.3;
      ctx.drawImage(assets.token, x - size * 1.3, y - size * 1.3, size * 2.6, size * 2.6);
      ctx.globalAlpha = 1;
      ctx.drawImage(assets.token, x - size, y - size, size * 2, size * 2);
    } else {
      // Fallback: golden circle with enhanced lighting
      ctx.fillStyle = 'oklch(0.78 0.24 75)';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = 'oklch(0.85 0.26 80)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.restore();
  });

  // Draw obstacles (toads) with enhanced sprite rendering
  gameState.obstacles.forEach((obstacle) => {
    const x = obstacle.x * width;
    const y = obstacle.y * height;
    const size = obstacle.size * width;

    ctx.save();
    
    // Menacing red glow
    ctx.shadowBlur = 25;
    ctx.shadowColor = 'oklch(0.55 0.22 30)';

    if (assets.hazard && assets.hazard.complete) {
      // Enhanced sprite rendering with shadow
      ctx.globalAlpha = 0.2;
      ctx.drawImage(assets.hazard, x - size * 1.2, y - size * 1.2, size * 2.4, size * 2.4);
      ctx.globalAlpha = 1;
      ctx.drawImage(assets.hazard, x - size, y - size, size * 2, size * 2);
    } else {
      // Fallback: reddish circle
      ctx.fillStyle = 'oklch(0.55 0.22 30)';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = 'oklch(0.65 0.24 35)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.restore();
  });

  // Draw player with sprite-based rendering
  const playerX = gameState.player.x * width;
  const playerY = gameState.player.y * height;
  const playerSize = gameState.player.size * width;

  ctx.save();

  // Player glow based on combo
  if (gameState.streak > 0) {
    const glowIntensity = Math.min(gameState.streak / 10, 1);
    ctx.shadowBlur = 30 + glowIntensity * 20;
    ctx.shadowColor = `oklch(0.68 0.19 135 / ${glowIntensity})`;
  }

  if (assets.uiSheet && assets.uiSheet.complete) {
    // Draw player sprite from icon sheet (top-left quadrant)
    const spriteSize = 256;
    ctx.drawImage(
      assets.uiSheet,
      0, 0, spriteSize, spriteSize,
      playerX - playerSize, playerY - playerSize, playerSize * 2, playerSize * 2
    );
  } else {
    // Fallback: Pepe green circle
    ctx.fillStyle = 'oklch(0.68 0.19 135)';
    ctx.beginPath();
    ctx.arc(playerX, playerY, playerSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'oklch(0.75 0.22 140)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Eyes
    ctx.fillStyle = 'oklch(0.95 0.01 110)';
    ctx.beginPath();
    ctx.arc(playerX - playerSize * 0.3, playerY - playerSize * 0.2, playerSize * 0.2, 0, Math.PI * 2);
    ctx.arc(playerX + playerSize * 0.3, playerY - playerSize * 0.2, playerSize * 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'oklch(0.15 0.02 120)';
    ctx.beginPath();
    ctx.arc(playerX - playerSize * 0.3, playerY - playerSize * 0.15, playerSize * 0.1, 0, Math.PI * 2);
    ctx.arc(playerX + playerSize * 0.3, playerY - playerSize * 0.15, playerSize * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  // Restore context after shake
  ctx.restore();
}
