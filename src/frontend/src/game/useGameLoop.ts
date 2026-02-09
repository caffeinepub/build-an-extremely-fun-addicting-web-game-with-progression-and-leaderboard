import { useEffect, useRef, useState } from 'react';
import type { GameState, Obstacle, Particle, PowerUp } from './gameTypes';
import { getDifficulty } from './balance/difficulty';
import { createParticleBurst } from './fx/particles';
import { playSound } from './audio/sfx';

interface UseGameLoopProps {
  isPaused: boolean;
  onGameOver: (score: number, streak: number, coins: number, time: number) => void;
  onScoreUpdate: (score: number) => void;
  onStreakUpdate: (streak: number) => void;
  onCoinsUpdate: (coins: number) => void;
  onTimeUpdate: (time: number) => void;
  reducedMotion: boolean;
  soundEnabled: boolean;
}

export function useGameLoop({
  isPaused,
  onGameOver,
  onScoreUpdate,
  onStreakUpdate,
  onCoinsUpdate,
  onTimeUpdate,
  reducedMotion,
  soundEnabled,
}: UseGameLoopProps) {
  const [gameState, setGameState] = useState<GameState>({
    player: { x: 0.5, y: 0.8, size: 0.03, speed: 0.015 },
    obstacles: [],
    powerUps: [],
    particles: [],
    score: 0,
    streak: 0,
    coins: 0,
    time: 0,
    isGameOver: false,
    shake: 0,
  });

  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const powerUpTimerRef = useRef<number>(0);

  const resetGame = () => {
    setGameState({
      player: { x: 0.5, y: 0.8, size: 0.03, speed: 0.015 },
      obstacles: [],
      powerUps: [],
      particles: [],
      score: 0,
      streak: 0,
      coins: 0,
      time: 0,
      isGameOver: false,
      shake: 0,
    });
    lastTimeRef.current = 0;
    spawnTimerRef.current = 0;
    powerUpTimerRef.current = 0;
  };

  useEffect(() => {
    if (isPaused || gameState.isGameOver) return;

    let animationId: number;

    const update = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setGameState((prev) => {
        const newTime = prev.time + deltaTime;
        const difficulty = getDifficulty(newTime);

        // Spawn obstacles
        spawnTimerRef.current += deltaTime;
        const newObstacles = [...prev.obstacles];
        if (spawnTimerRef.current >= difficulty.spawnInterval) {
          spawnTimerRef.current = 0;
          const size = 0.03 + Math.random() * 0.02;
          newObstacles.push({
            x: Math.random() * (1 - size),
            y: -0.05,
            size,
            speed: difficulty.obstacleSpeed * (0.8 + Math.random() * 0.4),
            type: Math.random() > 0.7 ? 'fast' : 'normal',
          });
        }

        // Spawn power-ups
        powerUpTimerRef.current += deltaTime;
        const newPowerUps = [...prev.powerUps];
        if (powerUpTimerRef.current >= 3 && Math.random() < 0.3) {
          powerUpTimerRef.current = 0;
          const size = 0.025;
          newPowerUps.push({
            x: Math.random() * (1 - size),
            y: -0.05,
            size,
            speed: 0.003,
            type: Math.random() > 0.5 ? 'coin' : 'shield',
          });
        }

        // Update obstacles
        const updatedObstacles = newObstacles
          .map((obs) => ({ ...obs, y: obs.y + obs.speed }))
          .filter((obs) => obs.y < 1.1);

        // Update power-ups
        const updatedPowerUps = newPowerUps
          .map((pu) => ({ ...pu, y: pu.y + pu.speed }))
          .filter((pu) => pu.y < 1.1);

        // Update particles
        const updatedParticles = prev.particles
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - deltaTime,
          }))
          .filter((p) => p.life > 0);

        // Check collisions with obstacles
        let isHit = false;
        for (const obs of updatedObstacles) {
          const dx = prev.player.x - obs.x;
          const dy = prev.player.y - obs.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < prev.player.size + obs.size) {
            isHit = true;
            break;
          }
        }

        // Check collisions with power-ups
        let newCoins = prev.coins;
        let newStreak = prev.streak;
        const collectedPowerUps: number[] = [];
        
        updatedPowerUps.forEach((pu, index) => {
          const dx = prev.player.x - pu.x;
          const dy = prev.player.y - pu.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < prev.player.size + pu.size) {
            collectedPowerUps.push(index);
            if (pu.type === 'coin') {
              newCoins += 1;
              newStreak += 1;
              if (soundEnabled) playSound('coin');
            }
            updatedParticles.push(...createParticleBurst(pu.x, pu.y, pu.type === 'coin' ? '#FFD700' : '#00FFFF'));
          }
        });

        const finalPowerUps = updatedPowerUps.filter((_, i) => !collectedPowerUps.includes(i));

        // Calculate score
        const newScore = prev.score + Math.floor(difficulty.scoreMultiplier * 10 * deltaTime * (1 + newStreak * 0.1));

        // Update shake
        const newShake = Math.max(0, prev.shake - deltaTime * 5);

        if (isHit) {
          if (soundEnabled) playSound('hit');
          onGameOver(newScore, newStreak, newCoins, newTime);
          return {
            ...prev,
            isGameOver: true,
            score: newScore,
            streak: newStreak,
            coins: newCoins,
            time: newTime,
          };
        }

        onScoreUpdate(newScore);
        onStreakUpdate(newStreak);
        onCoinsUpdate(newCoins);
        onTimeUpdate(newTime);

        return {
          ...prev,
          obstacles: updatedObstacles,
          powerUps: finalPowerUps,
          particles: updatedParticles,
          score: newScore,
          streak: newStreak,
          coins: newCoins,
          time: newTime,
          shake: newShake,
        };
      });

      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused, gameState.isGameOver, onGameOver, onScoreUpdate, onStreakUpdate, onCoinsUpdate, onTimeUpdate, soundEnabled]);

  return { gameState, resetGame };
}
