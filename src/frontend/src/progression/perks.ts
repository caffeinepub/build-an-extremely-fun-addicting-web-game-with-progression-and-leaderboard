export interface Perk {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  type: 'cosmetic' | 'gameplay';
}

export const PERKS: Perk[] = [
  {
    id: 'neon_trail',
    name: 'Pepe Trail',
    description: 'Leave a glowing green trail as you hop',
    cost: 10,
    icon: '✨',
    type: 'cosmetic',
  },
  {
    id: 'speed_boost',
    name: 'Turbo Hop',
    description: 'Move 20% faster to dodge those toads',
    cost: 15,
    icon: '⚡',
    type: 'gameplay',
  },
  {
    id: 'coin_magnet',
    name: 'Token Magnet',
    description: 'Attract tokens from greater distance',
    cost: 12,
    icon: '🧲',
    type: 'gameplay',
  },
  {
    id: 'rainbow_skin',
    name: 'Rainbow Pepe',
    description: 'Cycle through rainbow colors like a true meme',
    cost: 20,
    icon: '🌈',
    type: 'cosmetic',
  },
  {
    id: 'shield_starter',
    name: 'Diamond Hands',
    description: 'Start each run with a protective shield',
    cost: 25,
    icon: '💎',
    type: 'gameplay',
  },
];
