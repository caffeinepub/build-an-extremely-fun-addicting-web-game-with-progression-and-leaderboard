import { X, Trophy, Clock } from 'lucide-react';
import { useGetLeaderboards } from '../api/useLeaderboards';
import { useState } from 'react';

interface LeaderboardPanelProps {
  onClose: () => void;
}

export default function LeaderboardPanel({ onClose }: LeaderboardPanelProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'allTime'>('daily');
  const { dailyLeaderboard, allTimeLeaderboard, isLoading } = useGetLeaderboards();

  const currentLeaderboard = activeTab === 'daily' ? dailyLeaderboard : allTimeLeaderboard;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-chart-1/20 to-chart-2/20 p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-chart-1" />
              <h2 className="text-3xl font-bold">Leaderboard</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'daily'
                  ? 'bg-chart-1 text-primary-foreground'
                  : 'bg-accent/50 hover:bg-accent'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setActiveTab('allTime')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'allTime'
                  ? 'bg-chart-1 text-primary-foreground'
                  : 'bg-accent/50 hover:bg-accent'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : !currentLeaderboard || currentLeaderboard.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No scores yet. Be the first to play!
            </div>
          ) : (
            <div className="space-y-2">
              {currentLeaderboard.map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                    index < 3
                      ? 'bg-gradient-to-r from-chart-1/20 to-chart-2/20 border border-chart-1/30'
                      : 'bg-accent/30'
                  }`}
                >
                  <div className="flex-shrink-0 w-8 text-center">
                    {index === 0 && <span className="text-2xl">🥇</span>}
                    {index === 1 && <span className="text-2xl">🥈</span>}
                    {index === 2 && <span className="text-2xl">🥉</span>}
                    {index > 2 && <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>}
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-bold">{Number(entry.points).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Streak: {Number(entry.streak)}</div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {new Date(Number(entry.scoreTimestamp) / 1000000).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
