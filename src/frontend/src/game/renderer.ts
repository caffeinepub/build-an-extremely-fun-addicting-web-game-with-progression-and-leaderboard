import type { GameState, InputState } from './gameTypes';

export function renderGame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gameState: GameState,
  inputState: InputState,
  reducedMotion: boolean
) {
  // Apply screen shake
  ctx.save();
  if (!reducedMotion && gameState.shake > 0) {
    const shakeX = (Math.random() - 0.5) * gameState.shake * 20;
    const shakeY = (Math.random() - 0.5) * gameState.shake * 20;
    ctx.translate(shakeX, shakeY);
  }

  // Clear canvas with gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#0a0a0a');
  gradient.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Draw grid lines
  ctx.strokeStyle = 'rgba(100, 100, 255, 0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 10; i++) {
    const y = (i / 10) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Update player position smoothly
  const targetX = inputState.targetX * width;
  const targetY = inputState.targetY * height;
  const currentX = gameState.player.x * width;
  const currentY = gameState.player.y * height;
  
  gameState.player.x += (inputState.targetX - gameState.player.x) * 0.15;
  gameState.player.y += (inputState.targetY - gameState.player.y) * 0.15;

  // Draw particles
  gameState.particles.forEach((particle) => {
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.life;
    ctx.beginPath();
    ctx.arc(particle.x * width, particle.y * height, particle.size * width, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Draw power-ups
  gameState.powerUps.forEach((powerUp) => {
    const x = powerUp.x * width;
    const y = powerUp.y * height;
    const size = powerUp.size * width;

    if (powerUp.type === 'coin') {
      // Draw coin
      ctx.fillStyle = '#FFD700';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#FFD700';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      // Draw shield
      ctx.fillStyle = '#00FFFF';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00FFFF';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  });

  // Draw obstacles
  gameState.obstacles.forEach((obstacle) => {
    const x = obstacle.x * width;
    const y = obstacle.y * height;
    const size = obstacle.size * width;

    if (obstacle.type === 'fast') {
      ctx.fillStyle = '#FF3366';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#FF3366';
    } else {
      ctx.fillStyle = '#FF6B6B';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#FF6B6B';
    }

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Draw player
  const playerX = gameState.player.x * width;
  const playerY = gameState.player.y * height;
  const playerSize = gameState.player.size * width;

  ctx.fillStyle = '#00FF88';
  ctx.shadowBlur = 30;
  ctx.shadowColor = '#00FF88';
  ctx.beginPath();
  ctx.arc(playerX, playerY, playerSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Draw player trail
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
  ctx.lineWidth = playerSize * 0.5;
  ctx.beginPath();
  ctx.moveTo(playerX, playerY);
  ctx.lineTo(playerX, playerY + playerSize * 2);
  ctx.stroke();

  ctx.restore();
}
