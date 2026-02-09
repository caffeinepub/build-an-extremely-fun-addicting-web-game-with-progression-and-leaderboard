import { useEffect, useState } from 'react';
import { Trophy, Coins, Zap, Clock, RotateCcw, Home } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSubmitScore } from '../hooks/useQueries';
import { useProgression } from '../progression/useProgression';
import { toast } from 'sonner';
import { GENERATED_ASSETS } from '../assets/generatedAssets';
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
      {/* Premium Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${GENERATED_ASSETS.menuBackground})`,
          imageRendering: 'auto',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background/95" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-card/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-border shadow-2xl">
          <div className="text-center space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-chart-1 via-destructive to-chart-4 bg-clip-text text-transparent drop-shadow-lg">
                REKT
              </h2>
              <p className="text-muted-foreground">The swamp got you! Here's your haul:</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-accent/60 to-accent/40 backdrop-blur-sm rounded-2xl p-6 space-y-2 border border-border/50 shadow-lg">
                <Trophy className="w-8 h-8 mx-auto text-chart-1 drop-shadow-lg" />
                <div className="text-3xl font-bold">{result.score.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Points</div>
              </div>

              <div className="bg-gradient-to-br from-accent/60 to-accent/40 backdrop-blur-sm rounded-2xl p-6 space-y-2 border border-border/50 shadow-lg">
                <Zap className="w-8 h-8 mx-auto text-chart-2 drop-shadow-lg" />
                <div className="text-3xl font-bold">{result.streak}</div>
                <div className="text-sm text-muted-foreground">Max Combo</div>
              </div>

              <div className="bg-gradient-to-br from-accent/60 to-accent/40 backdrop-blur-sm rounded-2xl p-6 space-y-2 border border-border/50 shadow-lg">
                <Coins className="w-8 h-8 mx-auto text-chart-4 drop-shadow-lg" />
                <div className="text-3xl font-bold">+{result.coinsEarned}</div>
                <div className="text-sm text-muted-foreground">Tokens Earned</div>
              </div>

              <div className="bg-gradient-to-br from-accent/60 to-accent/40 backdrop-blur-sm rounded-2xl p-6 space-y-2 border border-border/50 shadow-lg">
                <Clock className="w-8 h-8 mx-auto text-chart-3 drop-shadow-lg" />
                <div className="text-3xl font-bold">{formatTime(result.survivalTime)}</div>
                <div className="text-sm text-muted-foreground">Survived</div>
              </div>
            </div>

            {/* Personal Best */}
            {progression && result.score > progression.bestScore && (
              <div className="bg-gradient-to-r from-chart-1/20 to-chart-4/20 rounded-xl p-4 border border-chart-1/50 backdrop-blur-sm shadow-lg">
                <p className="text-lg font-bold text-chart-1 drop-shadow">🐸 NEW PERSONAL BEST!</p>
              </div>
            )}

            {/* Auth Message */}
            {!identity && (
              <div className="bg-accent/40 backdrop-blur-sm rounded-xl p-4 border border-border shadow-lg">
                <p className="text-sm text-muted-foreground">
                  Sign in to save your gains and compete on the leaderboard!
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={onRestart}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-chart-1 to-chart-4 hover:scale-105 text-primary-foreground font-bold text-lg transition-transform shadow-xl"
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </button>
              <button
                onClick={onBackToMenu}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-accent/80 backdrop-blur-sm hover:bg-accent font-bold text-lg transition-colors shadow-lg"
              >
                <Home className="w-5 h-5" />
                Exit Swamp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
