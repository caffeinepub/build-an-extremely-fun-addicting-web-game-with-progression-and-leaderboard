import { GENERATED_ASSETS } from '../assets/generatedAssets';

interface GeneratedIconProps {
  icon: 'player' | 'token' | 'hazard' | 'settings' | 'trophy' | 'sparkles';
  className?: string;
  size?: number;
}

// Icon positions in the 1024x1024 sprite sheet (4x4 grid, each icon 256x256)
const ICON_POSITIONS: Record<string, { x: number; y: number }> = {
  player: { x: 0, y: 0 },
  token: { x: 256, y: 0 },
  hazard: { x: 512, y: 0 },
  settings: { x: 768, y: 0 },
  trophy: { x: 0, y: 256 },
  sparkles: { x: 256, y: 256 },
};

export default function GeneratedIcon({ icon, className = '', size = 24 }: GeneratedIconProps) {
  const pos = ICON_POSITIONS[icon] || ICON_POSITIONS.player;
  
  return (
    <div
      className={`inline-block ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${GENERATED_ASSETS.uiIconsSheet})`,
        backgroundPosition: `-${pos.x * (size / 256)}px -${pos.y * (size / 256)}px`,
        backgroundSize: `${1024 * (size / 256)}px ${1024 * (size / 256)}px`,
        imageRendering: 'auto',
      }}
      aria-hidden="true"
    />
  );
}
