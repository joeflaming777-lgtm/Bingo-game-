// ============================================================
//  audioUtils.js  –  Web Audio API sound synthesizer
// ============================================================

let audioCtx = null;
let soundEnabled = true;

function getCtx() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return null;
    }
  }
  return audioCtx;
}

export function setSoundEnabled(val) {
  soundEnabled = val;
}

function playTone({ frequency = 440, type = 'sine', duration = 0.15, volume = 0.3, delay = 0 } = {}) {
  if (!soundEnabled) return;
  const ctx = getCtx();
  if (!ctx) return;

  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, t);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.start(t);
  osc.stop(t + duration);
}

export function playClickSound() {
  playTone({ frequency: 800, type: 'sine', duration: 0.08, volume: 0.2 });
}

export function playDaubSound() {
  playTone({ frequency: 523, type: 'triangle', duration: 0.2, volume: 0.35 });
  playTone({ frequency: 659, type: 'triangle', duration: 0.2, volume: 0.25, delay: 0.1 });
}

export function playBallCallSound() {
  playTone({ frequency: 440, type: 'sine', duration: 0.12, volume: 0.25 });
  playTone({ frequency: 550, type: 'sine', duration: 0.12, volume: 0.2, delay: 0.12 });
}

export function playWinFanfare() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    playTone({ frequency: freq, type: 'triangle', duration: 0.3, volume: 0.4, delay: i * 0.18 });
  });
  setTimeout(() => {
    [1047, 1319, 1568].forEach((freq, i) => {
      playTone({ frequency: freq, type: 'triangle', duration: 0.5, volume: 0.45, delay: i * 0.22 });
    });
  }, 800);
}

export function playErrorSound() {
  playTone({ frequency: 200, type: 'sawtooth', duration: 0.25, volume: 0.2 });
}
