import { useState } from 'react';
import { Trophy, Settings, Sparkles } from 'lucide-react';
import LoginButton from '../auth/LoginButton';
import LeaderboardPanel from '../components/LeaderboardPanel';
import UnlocksShop from '../progression/UnlocksShop';
import SettingsDialog from '../components/SettingsDialog';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface LandingScreenProps {
  onStartGame: () => void;
}

export default function LandingScreen({ onStartGame }: LandingScreenProps) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showUnlocks, setShowUnlocks] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { identity } = useInternetIdentity();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(/assets/generated/menu-background.dim_1920x1080.png)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src="/assets/generated/game-logo.dim_512x512.png" 
              alt="Neon Dodge"
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
              NEON DODGE
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <LoginButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
          <div className="text-center space-y-8 max-w-2xl">
            <img 
              src="/assets/generated/game-logo.dim_512x512.png" 
              alt="Neon Dodge"
              className="w-48 h-48 mx-auto object-contain animate-pulse"
            />
            
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 bg-clip-text text-transparent">
                  NEON DODGE
                </span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground">
                Dodge obstacles, collect power-ups, survive as long as you can!
              </p>
            </div>

            <button
              onClick={onStartGame}
              className="group relative px-12 py-6 text-2xl font-bold rounded-2xl bg-gradient-to-r from-chart-1 to-chart-2 text-primary-foreground hover:scale-105 transition-transform shadow-2xl"
            >
              <span className="relative z-10">START GAME</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-chart-2 to-chart-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={() => setShowLeaderboard(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent/80 transition-colors font-semibold"
              >
                <Trophy className="w-5 h-5" />
                Leaderboard
              </button>
              <button
                onClick={() => setShowUnlocks(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent/80 transition-colors font-semibold"
              >
                <Sparkles className="w-5 h-5" />
                Unlocks
              </button>
            </div>

            {!identity && (
              <p className="text-sm text-muted-foreground pt-4">
                Sign in to save your progress and compete on the leaderboard!
              </p>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} · Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>

      {/* Modals */}
      {showLeaderboard && (
        <LeaderboardPanel onClose={() => setShowLeaderboard(false)} />
      )}
      {showUnlocks && (
        <UnlocksShop onClose={() => setShowUnlocks(false)} />
      )}
      {showSettings && (
        <SettingsDialog onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
