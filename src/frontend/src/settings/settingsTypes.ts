export interface KeyBindings {
  left: string;
  right: string;
  up: string;
  down: string;
}

export interface Settings {
  soundMuted: boolean;
  reducedMotion: boolean;
  keyBindings: KeyBindings;
}

export const DEFAULT_SETTINGS: Settings = {
  soundMuted: false,
  reducedMotion: false,
  keyBindings: {
    left: 'a',
    right: 'd',
    up: 'w',
    down: 's',
  },
};
