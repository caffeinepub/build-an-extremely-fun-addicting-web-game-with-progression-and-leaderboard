import { Pause, Settings, Trophy, Zap, Coins, Clock } from 'lucide-react';

interface GameHUDProps {
  score: number;
  streak: number;
  coins: number;
  survivalTime: number;
  onPause: () => void;
  onSettings: () => void;
}

export default function GameHUD({
  score,
  streak,
  coins,
  survivalTime,
  onPause,
  onSettings,
}: GameHUDProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top Bar */}
      <div className="p-4 flex justify-between items-start pointer-events-auto">
        {/* Stats Panel */}
        <div className="bg-card/70 backdrop-blur-xl rounded-2xl p-4 border border-border/50 shadow-2xl space-y-2">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-chart-1 drop-shadow-lg" />
            <div>
              <div className="text-2xl font-bold">{score.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Points</div>
            </div>
          </div>
          
          {streak > 0 && (
            <div className="flex items-center gap-3 pt-2 border-t border-border/50">
              <Zap className="w-5 h-5 text-chart-2 drop-shadow-lg" />
              <div>
                <div className="text-xl font-bold text-chart-2">{streak}x</div>
                <div className="text-xs text-muted-foreground">Combo</div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={onSettings}
            className="p-3 rounded-xl bg-card/70 backdrop-blur-xl hover:bg-card/90 border border-border/50 transition-colors shadow-lg"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={onPause}
            className="p-3 rounded-xl bg-card/70 backdrop-blur-xl hover:bg-card/90 border border-border/50 transition-colors shadow-lg"
            aria-label="Pause"
          >
            <Pause className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end pointer-events-auto">
        <div className="bg-card/70 backdrop-blur-xl rounded-2xl px-4 py-3 border border-border/50 shadow-2xl flex items-center gap-3">
          <Coins className="w-6 h-6 text-chart-4 drop-shadow-lg" />
          <div>
            <div className="text-xl font-bold">{coins}</div>
            <div className="text-xs text-muted-foreground">Tokens</div>
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-xl rounded-2xl px-4 py-3 border border-border/50 shadow-2xl flex items-center gap-3">
          <Clock className="w-6 h-6 text-chart-3 drop-shadow-lg" />
          <div>
            <div className="text-xl font-bold">{formatTime(survivalTime)}</div>
            <div className="text-xs text-muted-foreground">Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
