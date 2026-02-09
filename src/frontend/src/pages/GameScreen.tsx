import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import GameCanvas from '../game/GameCanvas';
import GameHUD from '../components/GameHUD';
import SettingsDialog from '../components/SettingsDialog';
import { useSettings } from '../settings/useSettings';
import type { GameResult } from '../App';

interface GameScreenProps {
  onGameOver: (result: GameResult) => void;
}

export default function GameScreen({ onGameOver }: GameScreenProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(0);
  const [survivalTime, setSurvivalTime] = useState(0);
  const { settings } = useSettings();

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
    setShowSettings(false);
  };

  const handleSettings = () => {
    setIsPaused(true);
    setShowSettings(true);
  };

  const handleGameOver = (finalScore: number, finalStreak: number, finalCoins: number, time: number) => {
    onGameOver({
      score: finalScore,
      streak: finalStreak,
      coinsEarned: finalCoins,
      survivalTime: time,
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <GameCanvas
        isPaused={isPaused}
        onGameOver={handleGameOver}
        onScoreUpdate={setScore}
        onStreakUpdate={setStreak}
        onCoinsUpdate={setCoins}
        onTimeUpdate={setSurvivalTime}
        reducedMotion={settings.reducedMotion}
        soundEnabled={!settings.soundMuted}
      />

      <GameHUD
        score={score}
        streak={streak}
        coins={coins}
        survivalTime={survivalTime}
        onPause={handlePause}
        onSettings={handleSettings}
      />

      {isPaused && !showSettings && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-bold">PAUSED</h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleResume}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-chart-1 hover:bg-chart-1/80 text-primary-foreground font-bold text-lg transition-colors"
              >
                <Play className="w-5 h-5" />
                Resume
              </button>
              <button
                onClick={handleSettings}
                className="px-8 py-4 rounded-xl bg-accent hover:bg-accent/80 font-bold text-lg transition-colors"
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <SettingsDialog onClose={handleResume} />
      )}
    </div>
  );
}
