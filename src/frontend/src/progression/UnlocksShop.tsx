import { X, Coins, Lock, Check } from 'lucide-react';
import { useProgression } from './useProgression';
import { PERKS } from './perks';
import { toast } from 'sonner';

interface UnlocksShopProps {
  onClose: () => void;
}

export default function UnlocksShop({ onClose }: UnlocksShopProps) {
  const { progression, unlockPerk } = useProgression();

  const handleUnlock = (perkId: string, cost: number) => {
    if (!progression) return;

    if (progression.coins < cost) {
      toast.error('Not enough tokens!');
      return;
    }

    unlockPerk(perkId);
    toast.success('Power-up unlocked!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-card/90 backdrop-blur-xl rounded-3xl border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-chart-4/20 to-chart-1/20 p-6 border-b border-border backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coins className="w-8 h-8 text-chart-4 drop-shadow-lg" />
              <div>
                <h2 className="text-3xl font-bold">Power-Up Shop</h2>
                <p className="text-sm text-muted-foreground">
                  Your tokens: <span className="font-bold text-chart-4">{progression?.coins || 0}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent/80 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PERKS.map((perk) => {
              const isUnlocked = progression?.unlockedPerks.includes(perk.id) || false;
              const canAfford = (progression?.coins || 0) >= perk.cost;

              return (
                <div
                  key={perk.id}
                  className={`p-6 rounded-2xl border transition-all shadow-lg backdrop-blur-sm ${
                    isUnlocked
                      ? 'bg-chart-1/10 border-chart-1/30'
                      : 'bg-accent/40 border-border hover:border-chart-4/50 hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl drop-shadow-lg">{perk.icon}</div>
                    {isUnlocked && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-chart-1/20 text-chart-1 text-xs font-bold shadow-md">
                        <Check className="w-3 h-3" />
                        OWNED
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2">{perk.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{perk.description}</p>

                  {!isUnlocked && (
                    <button
                      onClick={() => handleUnlock(perk.id, perk.cost)}
                      disabled={!canAfford}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all shadow-lg ${
                        canAfford
                          ? 'bg-chart-4 hover:bg-chart-4/80 hover:scale-105 text-primary-foreground'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? <Coins className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                      {perk.cost} Tokens
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
