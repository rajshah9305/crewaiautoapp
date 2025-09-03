// A simple audio player for UI sound effects.
// Sounds have been disabled per user request.

type Sound = 'deploy' | 'click' | 'complete' | 'error' | 'typing';

export const playSound = async (sound: Sound, volume: number = 0.5) => {
  // This function is intentionally left empty to disable all sounds.
};
