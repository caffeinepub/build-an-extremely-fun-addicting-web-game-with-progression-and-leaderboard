export interface Difficulty {
  obstacleSpeed: number;
  spawnInterval: number;
  scoreMultiplier: number;
}

export function getDifficulty(time: number): Difficulty {
  // Difficulty ramps up over time
  const baseSpeed = 0.005;
  const maxSpeed = 0.015;
  const speedIncrease = Math.min((time / 60) * 0.01, maxSpeed - baseSpeed);

  const baseInterval = 0.8;
  const minInterval = 0.3;
  const intervalDecrease = Math.min((time / 60) * 0.5, baseInterval - minInterval);

  const baseMultiplier = 1;
  const maxMultiplier = 3;
  const multiplierIncrease = Math.min((time / 60) * 2, maxMultiplier - baseMultiplier);

  return {
    obstacleSpeed: baseSpeed + speedIncrease,
    spawnInterval: baseInterval - intervalDecrease,
    scoreMultiplier: baseMultiplier + multiplierIncrease,
  };
}
