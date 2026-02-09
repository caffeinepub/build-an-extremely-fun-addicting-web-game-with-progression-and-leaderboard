import type { Particle } from '../gameTypes';

export function createParticleBurst(x: number, y: number, color: string): Particle[] {
  const particles: Particle[] = [];
  const count = 12;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const speed = 0.002 + Math.random() * 0.004;
    const size = 0.004 + Math.random() * 0.006;
    
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size,
      color,
      life: 1,
    });
  }

  return particles;
}
