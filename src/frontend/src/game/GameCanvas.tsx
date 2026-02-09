import { useEffect, useRef } from 'react';
import { useGameLoop } from './useGameLoop';
import { usePlayerInput } from './input/usePlayerInput';
import { renderGame } from './renderer';

interface GameCanvasProps {
  isPaused: boolean;
  onGameOver: (score: number, streak: number, coins: number, time: number) => void;
  onScoreUpdate: (score: number) => void;
  onStreakUpdate: (streak: number) => void;
  onCoinsUpdate: (coins: number) => void;
  onTimeUpdate: (time: number) => void;
  onMultiplierUpdate: (multiplier: number) => void;
  reducedMotion: boolean;
  soundEnabled: boolean;
}

export default function GameCanvas({
  isPaused,
  onGameOver,
  onScoreUpdate,
  onStreakUpdate,
  onCoinsUpdate,
  onTimeUpdate,
  onMultiplierUpdate,
  reducedMotion,
  soundEnabled,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState, resetGame } = useGameLoop({
    isPaused,
    onGameOver,
    onScoreUpdate,
    onStreakUpdate,
    onCoinsUpdate,
    onTimeUpdate,
    onMultiplierUpdate,
    reducedMotion,
    soundEnabled,
  });

  const { inputState } = usePlayerInput(canvasRef, !isPaused);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      // Use visual viewport dimensions when available for accurate sizing
      const width = window.visualViewport?.width ?? window.innerWidth;
      const height = window.visualViewport?.height ?? window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      // Set display size (CSS pixels)
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Set actual size in memory (scaled for device pixel ratio)
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      // Scale context to match device pixel ratio
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    
    // Listen to all relevant resize events
    window.addEventListener('resize', resizeCanvas);
    window.visualViewport?.addEventListener('resize', resizeCanvas);
    document.addEventListener('fullscreenchange', resizeCanvas);
    document.addEventListener('webkitfullscreenchange', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.visualViewport?.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('fullscreenchange', resizeCanvas);
      document.removeEventListener('webkitfullscreenchange', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isPaused) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      // Use display dimensions for rendering (not the scaled buffer size)
      const width = window.visualViewport?.width ?? window.innerWidth;
      const height = window.visualViewport?.height ?? window.innerHeight;
      renderGame(ctx, width, height, gameState, inputState, reducedMotion);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [gameState, inputState, isPaused, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full touch-none"
      style={{ display: 'block' }}
    />
  );
}
