export interface Player {
  x: number;
  y: number;
  size: number;
  speed: number;
}

export interface Obstacle {
  x: number;
  y: number;
  size: number;
  speed: number;
  type: 'normal' | 'fast';
}

export interface PowerUp {
  x: number;
  y: number;
  size: number;
  speed: number;
  type: 'coin' | 'shield';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

export interface GameState {
  player: Player;
  obstacles: Obstacle[];
  powerUps: PowerUp[];
  particles: Particle[];
  score: number;
  streak: number;
  coins: number;
  time: number;
  multiplier: number;
  isGameOver: boolean;
  shake: number;
}

export interface InputState {
  targetX: number;
  targetY: number;
  isActive: boolean;
}
