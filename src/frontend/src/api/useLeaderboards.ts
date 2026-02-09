import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import type { GameScore } from '../backend';

export function useGetLeaderboards() {
  const { actor, isFetching: actorFetching } = useActor();

  const dailyQuery = useQuery<GameScore[]>({
    queryKey: ['dailyLeaderboard'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDailyLeaderboard();
    },
    enabled: !!actor && !actorFetching,
  });

  const allTimeQuery = useQuery<GameScore[]>({
    queryKey: ['allTimeLeaderboard'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !actorFetching,
  });

  return {
    dailyLeaderboard: dailyQuery.data || [],
    allTimeLeaderboard: allTimeQuery.data || [],
    isLoading: dailyQuery.isLoading || allTimeQuery.isLoading,
  };
}
