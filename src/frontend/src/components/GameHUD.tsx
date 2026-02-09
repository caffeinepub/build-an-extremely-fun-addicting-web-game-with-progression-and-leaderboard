import { Pause, Settings, Coins } from 'lucide-react';

interface GameHUDProps {
  score: number;
  streak: number;
  coins: number;
  survivalTime: number;
  onPause: () => void;
  onSettings: () => void;
}

export default function GameHUD({ score, streak, coins, survivalTime, onPause, onSettings }: GameHUDProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-auto">
        <div className="space-y-2">
          <div className="bg-background/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-border">
            <div className="text-sm text-muted-foreground">Score</div>
            <div className="text-2xl font-bold">{score.toLocaleString()}</div>
          </div>
          {streak > 0 && (
            <div className="bg-chart-1/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-chart-1/50">
              <div className="text-sm text-chart-1">Streak: {streak}x</div>
            </div>
          )}
        </div>

        <div className="flex items-start gap-2">
          <div className="bg-background/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-border flex items-center gap-2">
            <Coins className="w-5 h-5 text-chart-4" />
            <span className="font-bold">{coins}</span>
          </div>
          <button
            onClick={onPause}
            className="p-3 rounded-xl bg-background/80 backdrop-blur-sm border border-border hover:bg-accent transition-colors"
            aria-label="Pause"
          >
            <Pause className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center pointer-events-auto">
        <div className="bg-background/80 backdrop-blur-sm rounded-xl px-6 py-3 border border-border">
          <div className="text-lg font-mono font-bold">{formatTime(survivalTime)}</div>
        </div>
      </div>
    </div>
  );
}
