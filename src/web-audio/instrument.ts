// A small software instrument on the Web Audio API. One voice model covers both
// tuned parts and drums: every sound is some oscillators and/or noise, through an
// optional filter, shaped by an ADSR envelope. A Patch sets all of it.

export type Oscillator = {
  type: OscillatorType;
  // Detune in cents, octave offset, and level relative to the other layers.
  detune?: number;
  octave?: number;
  gain?: number;
};

export type Patch = {
  oscillators: Oscillator[];
  // Level of a white-noise layer, for drums and breath. Omit for none.
  noise?: number;
  // Seconds, except sustain, which is a level 0-1.
  envelope: { attack: number; decay: number; sustain: number; release: number };
  // Ignore note length: play the attack, then decay to silence. For drums.
  percussive?: boolean;
  // `envelope` Hz are added to the cutoff at the attack peak, then fall back with the decay.
  filter?: { type: BiquadFilterType; frequency: number; q?: number; envelope?: number };
  // Start this many semitones sharp and glide down to the note over `time` seconds.
  pitchDrop?: { semitones: number; time: number };
  // A feedback delay on the instrument's output.
  echo?: { time: number; feedback: number; mix: number };
  // Overall level.
  gain?: number;
};

const SEMITONES: Record<string, number> = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };

/** Frequency in Hz of a note name like 'A4', 'C#5' or 'Bb2' (A4 = 440). */
export function noteFrequency(note: string) {
  const match = /^([A-G])([#b]?)(-?\d)$/.exec(note);
  if (!match) {
    throw new Error(`Not a note: ${note}`);
  }
  const [, letter, accidental, octave] = match;
  const semitone = SEMITONES[letter] + (accidental === '#' ? 1 : accidental === 'b' ? -1 : 0) + (Number(octave) - 4) * 12;
  return 440 * 2 ** (semitone / 12);
}

// One second of white noise per context, shared by every noisy note.
const noiseBuffers = new WeakMap<BaseAudioContext, AudioBuffer>();

function noiseBuffer(ctx: BaseAudioContext) {
  let buffer = noiseBuffers.get(ctx);
  if (!buffer) {
    buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noiseBuffers.set(ctx, buffer);
  }
  return buffer;
}

export class Instrument {
  private readonly ctx: BaseAudioContext;
  private readonly patch: Patch;
  // Every note plays into this, and it plays into the output (and the echo, if any).
  private readonly bus: GainNode;

  constructor(ctx: BaseAudioContext, output: AudioNode, patch: Patch) {
    this.ctx = ctx;
    this.patch = patch;
    this.bus = new GainNode(ctx, { gain: patch.gain ?? 1 });
    this.bus.connect(output);

    if (patch.echo) {
      const delay = new DelayNode(ctx, { delayTime: patch.echo.time, maxDelayTime: patch.echo.time });
      const feedback = new GainNode(ctx, { gain: patch.echo.feedback });
      const wet = new GainNode(ctx, { gain: patch.echo.mix });
      this.bus.connect(delay).connect(feedback).connect(delay);
      delay.connect(wet).connect(output);
    }
  }

  /** Schedule a note. `when` and `duration` are in seconds on the context's clock. */
  play(note: string, when: number, duration: number, velocity = 1) {
    const { ctx, patch } = this;
    const { attack, decay, sustain, release } = patch.envelope;
    const frequency = noteFrequency(note);
    const off = when + (patch.percussive ? attack + decay : Math.max(duration, attack));
    const end = off + release + 0.05;

    // Volume envelope. Each setTargetAtTime starts from wherever the last one had got to,
    // so a note released before it reaches its sustain level still fades smoothly.
    const amp = new GainNode(ctx, { gain: 0 });
    amp.gain.setValueAtTime(0, when);
    amp.gain.linearRampToValueAtTime(velocity, when + attack);
    amp.gain.setTargetAtTime(patch.percussive ? 0 : velocity * sustain, when + attack, decay / 4);
    amp.gain.setTargetAtTime(0, off, release / 5);
    amp.connect(this.bus);

    let input: AudioNode = amp;
    if (patch.filter) {
      const { type, frequency: cutoff, q = 1, envelope = 0 } = patch.filter;
      const filter = new BiquadFilterNode(ctx, { type, frequency: cutoff, Q: q });
      if (envelope) {
        filter.frequency.setValueAtTime(cutoff, when);
        filter.frequency.linearRampToValueAtTime(cutoff + envelope * velocity, when + attack);
        filter.frequency.setTargetAtTime(cutoff, when + attack, decay / 4);
      }
      filter.connect(amp);
      input = filter;
    }

    const sources: AudioScheduledSourceNode[] = [];
    for (const layer of patch.oscillators) {
      const pitch = frequency * 2 ** (layer.octave ?? 0);
      const osc = new OscillatorNode(ctx, { type: layer.type, frequency: pitch, detune: layer.detune ?? 0 });
      if (patch.pitchDrop) {
        osc.frequency.setValueAtTime(pitch * 2 ** (patch.pitchDrop.semitones / 12), when);
        osc.frequency.exponentialRampToValueAtTime(pitch, when + patch.pitchDrop.time);
      }
      osc.connect(new GainNode(ctx, { gain: layer.gain ?? 1 })).connect(input);
      sources.push(osc);
    }
    if (patch.noise) {
      const noise = new AudioBufferSourceNode(ctx, { buffer: noiseBuffer(ctx), loop: true });
      noise.connect(new GainNode(ctx, { gain: patch.noise })).connect(input);
      sources.push(noise);
    }

    for (const source of sources) {
      source.start(when);
      source.stop(end);
    }
    sources[sources.length - 1].onended = () => amp.disconnect();
  }
}
