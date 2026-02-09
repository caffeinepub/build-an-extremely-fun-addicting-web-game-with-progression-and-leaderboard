import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useUnlockPerk } from '../hooks/useQueries';

interface Progression {
  coins: number;
  bestScore: number;
  unlockedPerks: string[];
}

const STORAGE_KEY = 'neon_dodge_progression';

export function useProgression() {
  const { identity } = useInternetIdentity();
  const { mutate: unlockPerkBackend } = useUnlockPerk();
  const [progression, setProgression] = useState<Progression | null>(null);

  // Load progression from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProgression(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse progression:', error);
        setProgression({ coins: 0, bestScore: 0, unlockedPerks: [] });
      }
    } else {
      setProgression({ coins: 0, bestScore: 0, unlockedPerks: [] });
    }
  }, []);

  // Save progression to localStorage
  useEffect(() => {
    if (progression) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progression));
    }
  }, [progression]);

  const addCoins = (amount: number) => {
    setProgression((prev) => {
      if (!prev) return prev;
      return { ...prev, coins: prev.coins + amount };
    });
  };

  const unlockPerk = (perkId: string) => {
    setProgression((prev) => {
      if (!prev) return prev;
      const perk = prev.unlockedPerks.find((p) => p === perkId);
      if (perk) return prev;

      const cost = 10; // This should match the perk cost
      if (prev.coins < cost) return prev;

      // Call backend if authenticated
      if (identity) {
        unlockPerkBackend(perkId);
      }

      return {
        ...prev,
        coins: prev.coins - cost,
        unlockedPerks: [...prev.unlockedPerks, perkId],
      };
    });
  };

  const updateBestScore = (score: number) => {
    setProgression((prev) => {
      if (!prev) return prev;
      if (score > prev.bestScore) {
        return { ...prev, bestScore: score };
      }
      return prev;
    });
  };

  return {
    progression,
    addCoins,
    unlockPerk,
    updateBestScore,
  };
}
