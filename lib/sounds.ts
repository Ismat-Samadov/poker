// Web Audio API sound effects — no external audio files needed
// All sounds are programmatically generated

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function play(
  type: OscillatorType,
  frequency: number,
  duration: number,
  volume = 0.3,
  startTime?: number,
): void {
  try {
    const ctx = getCtx();
    const t = startTime ?? ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  } catch {
    // Silently ignore audio errors (e.g., user hasn't interacted yet)
  }
}

/** Card deal sound — quick crisp tick */
export function playDeal(): void {
  play('square', 800, 0.06, 0.15);
  play('square', 600, 0.06, 0.1, (audioCtx?.currentTime ?? 0) + 0.04);
}

/** Chip click */
export function playChip(): void {
  play('triangle', 1200, 0.1, 0.2);
  play('triangle', 900, 0.08, 0.15, (audioCtx?.currentTime ?? 0) + 0.03);
}

/** Win fanfare */
export function playWin(): void {
  const ctx = getCtx();
  const t = ctx.currentTime;
  const notes = [523, 659, 784, 1047]; // C E G C
  notes.forEach((freq, i) => {
    play('sine', freq, 0.3, 0.4, t + i * 0.15);
  });
}

/** Lose sound */
export function playLose(): void {
  const ctx = getCtx();
  const t = ctx.currentTime;
  play('sawtooth', 300, 0.3, 0.3, t);
  play('sawtooth', 200, 0.5, 0.3, t + 0.2);
}

/** Fold sound */
export function playFold(): void {
  play('sawtooth', 400, 0.15, 0.2);
}

/** Button click */
export function playClick(): void {
  play('square', 440, 0.05, 0.1);
}

/** Turn/River card reveal */
export function playReveal(): void {
  play('sine', 660, 0.12, 0.15);
  play('sine', 880, 0.12, 0.1, (audioCtx?.currentTime ?? 0) + 0.08);
}
