/**
 * Tiny synthesized sound kit (no audio files). Muted by default; the dock
 * toggle flips it and the choice persists in localStorage.
 */

export type SoundKind = "key" | "enter" | "ok" | "error" | "flag" | "beep" | "boot";

const STORAGE_KEY = "krg-sound";
export const SOUND_EVENT = "krg:sound";

let ctx: AudioContext | null = null;

export function isSoundOn(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

export function setSoundOn(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {}
  window.dispatchEvent(new CustomEvent(SOUND_EVENT, { detail: on }));
  if (on) play("ok");
}

function tone(
  audio: AudioContext,
  freq: number,
  start: number,
  duration: number,
  { type = "square", gain = 0.04 }: { type?: OscillatorType; gain?: number } = {}
) {
  const osc = audio.createOscillator();
  const amp = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime + start);
  amp.gain.setValueAtTime(0, audio.currentTime + start);
  amp.gain.linearRampToValueAtTime(gain, audio.currentTime + start + 0.005);
  amp.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + start + duration);
  osc.connect(amp).connect(audio.destination);
  osc.start(audio.currentTime + start);
  osc.stop(audio.currentTime + start + duration + 0.02);
}

export function play(kind: SoundKind) {
  if (typeof window === "undefined" || !isSoundOn()) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    const a = ctx;
    switch (kind) {
      case "key":
        tone(a, 1800 + Math.random() * 600, 0, 0.025, { gain: 0.015 });
        break;
      case "enter":
        tone(a, 900, 0, 0.05, { gain: 0.025 });
        break;
      case "ok":
        tone(a, 880, 0, 0.08, { type: "triangle", gain: 0.05 });
        tone(a, 1320, 0.07, 0.1, { type: "triangle", gain: 0.05 });
        break;
      case "error":
        tone(a, 180, 0, 0.18, { type: "sawtooth", gain: 0.04 });
        break;
      case "beep":
        tone(a, 1046, 0, 0.07, { type: "sine", gain: 0.06 });
        tone(a, 1568, 0.08, 0.07, { type: "sine", gain: 0.06 });
        break;
      case "boot":
        tone(a, 220, 0, 0.12, { type: "triangle", gain: 0.04 });
        tone(a, 440, 0.1, 0.12, { type: "triangle", gain: 0.04 });
        break;
      case "flag":
        [523, 659, 784, 1046].forEach((f, i) =>
          tone(a, f, i * 0.08, 0.16, { type: "triangle", gain: 0.05 })
        );
        break;
    }
  } catch {}
}
