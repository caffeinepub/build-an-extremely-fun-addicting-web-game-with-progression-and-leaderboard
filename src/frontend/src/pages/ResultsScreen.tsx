import { useEffect, useState } from 'react';
import { Trophy, Coins, Zap, Clock, RotateCcw, Home } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSubmitScore } from '../hooks/useQueries';
import { useProgression } from '../progression/useProgression';
import { toast } from 'sonner';
import type { GameResult } from '../App';

interface ResultsScreenProps {
  result: GameResult;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export default function ResultsScreen({ result, onRestart, onBackToMenu }: ResultsScreenProps) {
  const { identity } = useInternetIdentity();
  const { mutate: submitScore, isPending } = useSubmitScore();
  const { progression, addCoins } = useProgression();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    // Add coins to progression
    addCoins(result.coinsEarned);

    // Submit score if authenticated
    if (identity && !hasSubmitted) {
      submitScore(
        {
          points: BigInt(result.score),
          streak: BigInt(result.streak),
          perksEarned: [],
        },
        {
          onSuccess: () => {
            toast.success('Score submitted to leaderboard!');
            setHasSubmitted(true);
          },
          onError: (error) => {
            console.error('Failed to submit score:', error);
            toast.error('Failed to submit score');
          },
        }
      );
    }
  }, [identity, hasSubmitted, result, submitScore, addCoins]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: 'url(/assets/generated/menu-background.dim_1920x1080.png)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-card/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-border shadow-2xl">
          <div className="text-center space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
                GAME OVER
              </h2>
              <p className="text-muted-foreground">Nice run! Here's how you did:</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-accent/50 rounded-2xl p-6 space-y-2">
                <Trophy className="w-8 h-8 mx-auto text-chart-1" />
                <div className="text-3xl font-bold">{result.score.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>

              <div className="bg-accent/50 rounded-2xl p-6 space-y-2">
                <Zap className="w-8 h-8 mx-auto text-chart-2" />
                <div className="text-3xl font-bold">{result.streak}</div>
                <div className="text-sm text-muted-foreground">Max Streak</div>
              </div>

              <div className="bg-accent/50 rounded-2xl p-6 space-y-2">
                <Coins className="w-8 h-8 mx-auto text-chart-4" />
                <div className="text-3xl font-bold">+{result.coinsEarned}</div>
                <div className="text-sm text-muted-foreground">Coins Earned</div>
              </div>

              <div className="bg-accent/50 rounded-2xl p-6 space-y-2">
                <Clock className="w-8 h-8 mx-auto text-chart-3" />
                <div className="text-3xl font-bold">{formatTime(result.survivalTime)}</div>
                <div className="text-sm text-muted-foreground">Survival Time</div>
              </div>
            </div>

            {/* Personal Best */}
            {progression && result.score > progression.bestScore && (
              <div className="bg-gradient-to-r from-chart-1/20 to-chart-2/20 rounded-xl p-4 border border-chart-1/50">
                <p className="text-lg font-bold text-chart-1">🎉 NEW PERSONAL BEST!</p>
              </div>
            )}

            {/* Auth Message */}
            {!identity && (
              <div className="bg-accent/30 rounded-xl p-4 border border-border">
                <p className="text-sm text-muted-foreground">
                  Sign in to save your progress and compete on the leaderboard!
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={onRestart}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-chart-1 to-chart-2 hover:scale-105 text-primary-foreground font-bold text-lg transition-transform"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
              <button
                onClick={onBackToMenu}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-accent hover:bg-accent/80 font-bold text-lg transition-colors"
              >
                <Home className="w-5 h-5" />
                Main Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
