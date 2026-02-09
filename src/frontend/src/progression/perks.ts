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
    name: 'Neon Trail',
    description: 'Leave a glowing trail behind your player',
    cost: 10,
    icon: '✨',
    type: 'cosmetic',
  },
  {
    id: 'speed_boost',
    name: 'Speed Boost',
    description: 'Move 20% faster to dodge obstacles',
    cost: 15,
    icon: '⚡',
    type: 'gameplay',
  },
  {
    id: 'coin_magnet',
    name: 'Coin Magnet',
    description: 'Attract coins from a greater distance',
    cost: 12,
    icon: '🧲',
    type: 'gameplay',
  },
  {
    id: 'rainbow_skin',
    name: 'Rainbow Skin',
    description: 'Your player cycles through rainbow colors',
    cost: 20,
    icon: '🌈',
    type: 'cosmetic',
  },
  {
    id: 'shield_starter',
    name: 'Shield Starter',
    description: 'Start each run with a protective shield',
    cost: 25,
    icon: '🛡️',
    type: 'gameplay',
  },
];
