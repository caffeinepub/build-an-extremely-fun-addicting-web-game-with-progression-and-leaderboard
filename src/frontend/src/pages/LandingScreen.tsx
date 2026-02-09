import { useState } from 'react';
import { Trophy, Settings, Sparkles } from 'lucide-react';
import LoginButton from '../auth/LoginButton';
import LeaderboardPanel from '../components/LeaderboardPanel';
import UnlocksShop from '../progression/UnlocksShop';
import SettingsDialog from '../components/SettingsDialog';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { GENERATED_ASSETS } from '../assets/generatedAssets';

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
      {/* Premium Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${GENERATED_ASSETS.menuBackground})`,
          imageRendering: 'auto',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background/95" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 flex justify-between items-center backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <img 
              src={GENERATED_ASSETS.logo}
              alt="Pepe's Swamp Survival"
              className="w-14 h-14 object-contain drop-shadow-2xl"
              style={{ imageRendering: 'auto' }}
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-chart-1 via-chart-4 to-chart-2 bg-clip-text text-transparent drop-shadow-lg">
              PEPE SURVIVAL
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg hover:bg-accent/80 backdrop-blur-sm transition-colors"
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
              src={GENERATED_ASSETS.logo}
              alt="Pepe's Swamp Survival"
              className="w-56 h-56 mx-auto object-contain drop-shadow-2xl animate-pulse"
              style={{ imageRendering: 'auto' }}
            />
            
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black tracking-tight drop-shadow-2xl">
                <span className="bg-gradient-to-r from-chart-1 via-chart-4 to-chart-2 bg-clip-text text-transparent">
                  PEPE SURVIVAL
                </span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground drop-shadow-lg">
                Dodge the toads, stack tokens, survive the swamp!
              </p>
            </div>

            <button
              onClick={onStartGame}
              className="group relative px-12 py-6 text-2xl font-bold rounded-2xl bg-gradient-to-r from-chart-1 to-chart-4 text-primary-foreground hover:scale-105 transition-transform shadow-2xl overflow-hidden"
            >
              <span className="relative z-10">ENTER SWAMP</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-chart-4 to-chart-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={() => setShowLeaderboard(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent/80 backdrop-blur-sm hover:bg-accent transition-colors font-semibold shadow-lg"
              >
                <Trophy className="w-5 h-5" />
                Top Frogs
              </button>
              <button
                onClick={() => setShowUnlocks(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent/80 backdrop-blur-sm hover:bg-accent transition-colors font-semibold shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                Power-Ups
              </button>
            </div>

            {!identity && (
              <p className="text-sm text-muted-foreground pt-4 drop-shadow">
                Sign in to save your gains and compete on the leaderboard!
              </p>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-4 text-center text-sm text-muted-foreground backdrop-blur-sm">
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
