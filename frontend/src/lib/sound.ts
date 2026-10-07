"use client";

// Tiny Web Audio sound effects — synthesized, so no audio asset files needed.
let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = "sine") {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = ac.currentTime + start;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

// Cheerful rising two-note chime.
export function playCorrect() {
  tone(659, 0, 0.12, "triangle"); // E5
  tone(988, 0.1, 0.18, "triangle"); // B5
}

// Low "buzz" for a wrong answer.
export function playWrong() {
  tone(196, 0, 0.22, "sawtooth"); // G3
}

// Triumphant arpeggio for lesson completion.
export function playComplete() {
  tone(523, 0, 0.15, "triangle"); // C5
  tone(659, 0.12, 0.15, "triangle"); // E5
  tone(784, 0.24, 0.15, "triangle"); // G5
  tone(1047, 0.36, 0.3, "triangle"); // C6
}
