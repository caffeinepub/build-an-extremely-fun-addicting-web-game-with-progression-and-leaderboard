import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useSubmitScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      points,
      streak,
      perksEarned,
    }: {
      points: bigint;
      streak: bigint;
      perksEarned: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitScore(points, streak, perksEarned);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyLeaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['allTimeLeaderboard'] });
    },
  });
}

export function useUnlockPerk() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (perk: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unlockPerk(perk);
    },
  });
}
