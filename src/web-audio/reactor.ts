// Turns what an AnalyserNode hears into VisualParams: loudness makes the curves
// thicker and faster, and each bass hit kicks them outward and nudges the colour.

import { DEFAULT_PARAMS } from './visualizer';
import type { VisualParams } from './visualizer';

export type Levels = {
  // RMS of the waveform, 0-1.
  rms: number;
  // Average loudness of the lowest frequency bins, 0-1 (the analyser's dB scale).
  bass: number;
};

export type ReactorState = {
  // Smoothed loudness, 0-1.
  level: number;
  // Slow running average of `bass`; a beat is a jump above it.
  bassAverage: number;
  // 1 on a beat, decaying toward 0.
  pulse: number;
  sinceBeat: number;
  // After a beat, `bass` must dip clearly below its peak since then before the next one counts.
  peak: number;
  armed: boolean;
  // Degrees of hue shift built up by beats, and where it is easing toward.
  hue: number;
  hueTarget: number;
};

export const QUIET: ReactorState = { level: 0, bassAverage: 0, pulse: 0, sinceBeat: Infinity, peak: 0, armed: true, hue: 0, hueTarget: 0 };

// How far `bass` must jump above its average to count as a beat, and the shortest gap between beats.
const BEAT_JUMP = 0.1;
const BEAT_GAP = 0.18;
const HUE_PER_BEAT = 30;

/** Move `from` toward `to`, covering about 63% of the way every `seconds`. */
function ease(from: number, to: number, dt: number, seconds: number) {
  return from + (to - from) * (1 - Math.exp(-dt / seconds));
}

/** Advance the reactor by `dt` seconds of listening. Pure: returns a new state. */
export function react(state: ReactorState, { rms, bass }: Levels, dt: number) {
  const loudness = Math.min(1, rms * 6);
  const beat = state.armed && bass > state.bassAverage + BEAT_JUMP && state.sinceBeat + dt >= BEAT_GAP;
  const hueTarget = state.hueTarget + (beat ? HUE_PER_BEAT : 0);

  const next: ReactorState = {
    // Jump up quickly, settle back slowly.
    level: ease(state.level, loudness, dt, loudness > state.level ? 0.05 : 0.4),
    bassAverage: ease(state.bassAverage, bass, dt, 0.6),
    pulse: beat ? 1 : state.pulse * Math.exp(-dt / 0.2),
    sinceBeat: beat ? 0 : state.sinceBeat + dt,
    peak: beat ? bass : Math.max(state.peak, bass),
    armed: beat ? false : state.armed || bass < state.peak - BEAT_JUMP,
    hue: ease(state.hue, hueTarget, dt, 0.25),
    hueTarget,
  };

  // Silence gives exactly the resting look.
  const params: VisualParams = {
    ...DEFAULT_PARAMS,
    speed: DEFAULT_PARAMS.speed + 0.8 * next.level + 1.2 * next.pulse,
    hue: DEFAULT_PARAMS.hue + next.hue,
    lineWidth: DEFAULT_PARAMS.lineWidth + 3 * next.level + 2.5 * next.pulse,
    spread: DEFAULT_PARAMS.spread + 0.1 * next.pulse,
  };

  return { state: next, params, beat };
}

/** Read `analyser` once per animation frame and get back the params to draw with. */
export function createReactor(analyser: AnalyserNode) {
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0;
  const wave = new Float32Array(analyser.fftSize);
  const spectrum = new Uint8Array(analyser.frequencyBinCount);
  // Bins up to about 150 Hz: kick and bass. Bin 0 is DC, so skip it.
  const binHz = analyser.context.sampleRate / analyser.fftSize;
  const lastBin = Math.max(1, Math.round(150 / binHz));

  let state = QUIET;
  return (dt: number) => {
    analyser.getFloatTimeDomainData(wave);
    let sum = 0;
    for (const sample of wave) {
      sum += sample * sample;
    }

    analyser.getByteFrequencyData(spectrum);
    let low = 0;
    for (let bin = 1; bin <= lastBin; bin++) {
      low += spectrum[bin];
    }

    const result = react(state, { rms: Math.sqrt(sum / wave.length), bass: low / lastBin / 255 }, dt);
    state = result.state;
    return result.params;
  };
}
