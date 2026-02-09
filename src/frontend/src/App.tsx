import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import LandingScreen from './pages/LandingScreen';
import GameScreen from './pages/GameScreen';
import ResultsScreen from './pages/ResultsScreen';
import ProfileSetupDialog from './auth/ProfileSetupDialog';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './api/useUserProfile';

type GameState = 'landing' | 'playing' | 'results';

export interface GameResult {
  score: number;
  streak: number;
  coinsEarned: number;
  survivalTime: number;
}

function AppContent() {
  const [gameState, setGameState] = useState<GameState>('landing');
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleStartGame = () => {
    setGameState('playing');
    setGameResult(null);
  };

  const handleGameOver = (result: GameResult) => {
    setGameResult(result);
    setGameState('results');
  };

  const handleBackToMenu = () => {
    setGameState('landing');
  };

  return (
    <div className="min-h-screen bg-background">
      {showProfileSetup && <ProfileSetupDialog />}
      
      {gameState === 'landing' && (
        <LandingScreen onStartGame={handleStartGame} />
      )}
      
      {gameState === 'playing' && (
        <GameScreen onGameOver={handleGameOver} />
      )}
      
      {gameState === 'results' && gameResult && (
        <ResultsScreen 
          result={gameResult} 
          onRestart={handleStartGame}
          onBackToMenu={handleBackToMenu}
        />
      )}
      
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AppContent />
    </ThemeProvider>
  );
}
