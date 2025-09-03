// A Web Audio API-based sound engine for generating UI sound effects on the fly.
// This is a singleton-like module.

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isMuted: boolean = false;
let isInitialized: boolean = false;
let typingInterval: number | null = null;

/**
 * Initializes the AudioContext. Must be called after a user interaction (e.g., a click)
 * to comply with browser autoplay policies.
 */
const initialize = () => {
  if (isInitialized || typeof window === 'undefined') return;
  try {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
    masterGain.gain.setValueAtTime(0.4, audioCtx.currentTime); // Default volume
    isInitialized = true;
  } catch (e) {
    console.error("Web Audio API is not supported in this browser.", e);
  }
};

/**
 * Toggles the master mute state.
 * @returns The new mute state (true if muted, false if not).
 */
export const toggleMute = (): boolean => {
  if (!isInitialized) initialize(); // Try to init if not already
  if (!masterGain || !audioCtx) return isMuted;
  
  isMuted = !isMuted;
  masterGain.gain.setValueAtTime(isMuted ? 0 : 0.4, audioCtx.currentTime);
  if (isMuted) stopTypingSound();
  return isMuted;
};

type Sound = 'deploy' | 'click' | 'complete' | 'error';

/**
 * Plays a specified sound effect.
 * @param sound The name of the sound to play.
 */
export const playSound = (sound: Sound) => {
  if (!isInitialized) initialize(); // Try to init if not already
  if (!audioCtx || !masterGain) return;
  
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(masterGain);

  switch (sound) {
    case 'deploy':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      break;
    case 'complete':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      break;
    case 'error':
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      break;
    case 'click':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      break;
  }

  osc.start(now);
  osc.stop(now + 0.4);
};

const playKeySound = () => {
    if (!audioCtx || !masterGain || isMuted) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(masterGain);
    osc.type = 'square';
    osc.frequency.setValueAtTime(1500 + Math.random() * 200, now);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
}

export const startTypingSound = () => {
  if (typingInterval) return;
  if (!isInitialized) initialize();
  typingInterval = window.setInterval(playKeySound, 150 + Math.random() * 50);
}

export const stopTypingSound = () => {
    if (typingInterval) {
        window.clearInterval(typingInterval);
        typingInterval = null;
    }
}

export const soundEngine = {
    initialize,
    toggleMute,
    playSound,
    startTypingSound,
    stopTypingSound,
}