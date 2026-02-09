import { X, Volume2, VolumeX, Zap } from 'lucide-react';
import { useSettings } from '../settings/useSettings';

interface SettingsDialogProps {
  onClose: () => void;
}

export default function SettingsDialog({ onClose }: SettingsDialogProps) {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-card/90 backdrop-blur-xl rounded-3xl border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-chart-1/20 to-chart-4/20 p-6 border-b border-border backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Settings</h2>
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
        <div className="p-6 space-y-6">
          {/* Sound */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-accent/30 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-3">
              {settings.soundMuted ? (
                <VolumeX className="w-6 h-6 text-muted-foreground" />
              ) : (
                <Volume2 className="w-6 h-6 text-chart-1 drop-shadow-lg" />
              )}
              <div>
                <div className="font-semibold">Sound Effects</div>
                <div className="text-sm text-muted-foreground">Toggle game sounds</div>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ soundMuted: !settings.soundMuted })}
              className={`relative w-14 h-8 rounded-full transition-all shadow-lg ${
                settings.soundMuted ? 'bg-muted' : 'bg-chart-1'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                  settings.soundMuted ? 'left-1' : 'left-7'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-accent/30 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-chart-2 drop-shadow-lg" />
              <div>
                <div className="font-semibold">Reduced Motion</div>
                <div className="text-sm text-muted-foreground">Reduce screen shake & parallax</div>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`relative w-14 h-8 rounded-full transition-all shadow-lg ${
                settings.reducedMotion ? 'bg-chart-2' : 'bg-muted'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                  settings.reducedMotion ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Key Bindings */}
          <div className="space-y-3 p-4 rounded-xl bg-accent/30 backdrop-blur-sm shadow-lg">
            <div className="font-semibold">Keyboard Controls</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Move Left</label>
                <input
                  type="text"
                  value={settings.keyBindings.left}
                  onChange={(e) =>
                    updateSettings({
                      keyBindings: { ...settings.keyBindings, left: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border text-center font-mono uppercase shadow-inner"
                  maxLength={1}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Move Right</label>
                <input
                  type="text"
                  value={settings.keyBindings.right}
                  onChange={(e) =>
                    updateSettings({
                      keyBindings: { ...settings.keyBindings, right: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border text-center font-mono uppercase shadow-inner"
                  maxLength={1}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Move Up</label>
                <input
                  type="text"
                  value={settings.keyBindings.up}
                  onChange={(e) =>
                    updateSettings({
                      keyBindings: { ...settings.keyBindings, up: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border text-center font-mono uppercase shadow-inner"
                  maxLength={1}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Move Down</label>
                <input
                  type="text"
                  value={settings.keyBindings.down}
                  onChange={(e) =>
                    updateSettings({
                      keyBindings: { ...settings.keyBindings, down: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border text-center font-mono uppercase shadow-inner"
                  maxLength={1}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Arrow keys always work as backup</p>
          </div>
        </div>
      </div>
    </div>
  );
}
