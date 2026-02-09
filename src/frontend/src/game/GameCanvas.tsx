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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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

    const render = () => {
      renderGame(ctx, canvas.width, canvas.height, gameState, inputState, reducedMotion);
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
      style={{ touchAction: 'none' }}
    />
  );
}
