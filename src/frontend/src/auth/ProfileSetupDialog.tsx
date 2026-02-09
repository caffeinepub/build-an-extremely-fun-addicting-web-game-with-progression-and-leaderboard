import { useState } from 'react';
import { useSaveCallerUserProfile } from '../api/useUserProfile';
import { toast } from 'sonner';

export default function ProfileSetupDialog() {
  const [name, setName] = useState('');
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    saveProfile(
      { name: name.trim(), gamesPlayed: BigInt(0) },
      {
        onSuccess: () => {
          toast.success('Profile created!');
        },
        onError: (error) => {
          console.error('Failed to save profile:', error);
          toast.error('Failed to create profile');
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card rounded-3xl border border-border shadow-2xl p-8">
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome!</h2>
            <p className="text-muted-foreground">What should we call you?</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl bg-accent border border-border focus:outline-none focus:ring-2 focus:ring-chart-1"
              maxLength={20}
              autoFocus
            />

            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-chart-1 to-chart-2 hover:scale-105 text-primary-foreground font-bold transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              {isPending ? 'Creating...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
