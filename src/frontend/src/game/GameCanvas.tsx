import { useEffect, useRef, useState } from 'react';
import { useGameLoop } from './useGameLoop';
import { usePlayerInput } from './input/usePlayerInput';
import { renderGame } from './renderer';
import { loadRendererAssets } from './rendererAssets';

interface GameCanvasProps {
  isPaused: boolean;
  onGameOver: (score: number, streak: number, coins: number, time: number) => void;
  onScoreUpdate: (score: number) => void;
  onStreakUpdate: (streak: number) => void;
  onCoinsUpdate: (coins: number) => void;
  onTimeUpdate: (time: number) => void;
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
  reducedMotion,
  soundEnabled,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  
  const { gameState, resetGame } = useGameLoop({
    isPaused,
    onGameOver,
    onScoreUpdate,
    onStreakUpdate,
    onCoinsUpdate,
    onTimeUpdate,
    reducedMotion,
    soundEnabled,
  });

  const { inputState } = usePlayerInput(canvasRef, !isPaused);

  // Preload game assets
  useEffect(() => {
    loadRendererAssets().then(() => {
      setAssetsLoaded(true);
    });
  }, []);

  // Setup high-DPI canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Set display size (CSS pixels)
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      // Set actual size in memory (scaled for retina)
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Scale context to match DPI
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isPaused) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const dpr = window.devicePixelRatio || 1;

    const render = () => {
      // Use logical dimensions for rendering
      const logicalWidth = canvas.width / dpr;
      const logicalHeight = canvas.height / dpr;
      
      renderGame(ctx, logicalWidth, logicalHeight, gameState, inputState, reducedMotion);
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
      className="absolute inset-0 w-full h-full"
      style={{ 
        touchAction: 'none',
        imageRendering: 'auto',
      }}
    />
  );
}
