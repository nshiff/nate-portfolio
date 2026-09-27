// "Afterglow": A minor, 112 BPM, i-VI-III-VII. Seven four-bar sections, about a minute, then it loops.

import type { Patch } from './instrument';
import { parsePattern } from './score';
import type { Score, ScoreEvent } from './score';

const BPM = 112;

const PATCHES: Record<string, Patch> = {
  pad: {
    oscillators: [
      { type: 'sawtooth', detune: -9 },
      { type: 'sawtooth', detune: 9 },
      { type: 'triangle', octave: -1 },
    ],
    envelope: { attack: 0.6, decay: 1, sustain: 0.7, release: 1.2 },
    filter: { type: 'lowpass', frequency: 900, q: 1 },
    gain: 0.05,
  },
  bass: {
    oscillators: [{ type: 'sawtooth' }, { type: 'square', octave: -1, gain: 0.5 }],
    envelope: { attack: 0.005, decay: 0.15, sustain: 0.4, release: 0.08 },
    filter: { type: 'lowpass', frequency: 400, q: 8, envelope: 1200 },
    gain: 0.22,
  },
  lead: {
    oscillators: [{ type: 'square' }, { type: 'sawtooth', detune: 7, gain: 0.6 }],
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.25 },
    filter: { type: 'lowpass', frequency: 1800, q: 4, envelope: 2000 },
    // A dotted-eighth echo: three sixteenths.
    echo: { time: (3 * 60) / BPM / 4, feedback: 0.35, mix: 0.4 },
    gain: 0.08,
  },
  kick: {
    oscillators: [{ type: 'sine' }],
    envelope: { attack: 0.002, decay: 0.35, sustain: 0, release: 0.05 },
    percussive: true,
    pitchDrop: { semitones: 24, time: 0.07 },
    gain: 0.9,
  },
  snare: {
    oscillators: [{ type: 'triangle', gain: 0.4 }],
    noise: 1,
    envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.05 },
    percussive: true,
    filter: { type: 'highpass', frequency: 900 },
    gain: 0.3,
  },
  hat: {
    oscillators: [],
    noise: 1,
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 },
    percussive: true,
    filter: { type: 'highpass', frequency: 7000 },
    gain: 0.12,
  },
};

// The pitch each drum's x / X hits play.
const HITS: Record<string, string> = { kick: 'G1', snare: 'D3', hat: 'C4' };

const CHORDS = [
  { root: 'A', chord: 'A3+C4+E4' },
  { root: 'F', chord: 'F3+A3+C4' },
  { root: 'C', chord: 'C4+E4+G4' },
  { root: 'G', chord: 'G3+B3+D4' },
];

const wholeBar = (notes: string) => notes + ' -'.repeat(15);
const bassLine = (root: string) => `${root}2 - . ${root}3 . ${root}2 . ${root}3 ${root}2 - . ${root}3 . ${root}2 ${root}3 .`;

const DRUMS = {
  kick: 'X . . . X . . . X . . . X . . .',
  kickHalf: 'X . . . . . . . X . . . . . . .',
  snare: '. . . . X . . . . . . . X . . .',
  snareFill: '. . . . X . . . . . . . X . x x',
  hat: '. . x . . . x . . . x . . . x .',
  hatBusy: '. x X x . x X x . x X x . x X x',
};

const THEME = [
  'E5 - - . C5 - D5 - E5 - - - A4 - - .',
  'F5 - - . E5 - C5 - A4 - - - C5 - - .',
  'G5 - - . E5 - D5 - C5 - - - E5 - D5 -',
  'D5 - - - B4 - - - G4 - - - - - - .',
];

const THEME_HIGH = [
  'A5 - - . G5 - E5 - C5 - E5 - A5 - - -',
  'A5 - - . G5 - F5 - E5 - - - C5 - - .',
  'E5 - G5 - C6 - - - B5 - G5 - E5 - - .',
  'D5 - - - E5 - D5 - B4 - - - G4 - - .',
];

type Bar = [part: string, pattern: string][];

// Each section is four bars, one pass through the chords; `i` is the bar within it.
const SECTIONS: ((i: number) => Bar)[] = [
  // Intro: the chords alone, over a ticking hat.
  (i) => [['pad', wholeBar(CHORDS[i].chord)], ['hat', DRUMS.hat]],
  // The groove comes in.
  (i) => [
    ['pad', wholeBar(CHORDS[i].chord)], ['bass', bassLine(CHORDS[i].root)],
    ['kick', DRUMS.kick], ['hat', DRUMS.hat],
  ],
  // The theme.
  (i) => [
    ['pad', wholeBar(CHORDS[i].chord)], ['bass', bassLine(CHORDS[i].root)],
    ['kick', DRUMS.kick], ['snare', i === 3 ? DRUMS.snareFill : DRUMS.snare], ['hat', DRUMS.hat],
    ['lead', THEME[i]],
  ],
  // The theme, up high, with busier hats.
  (i) => [
    ['pad', wholeBar(CHORDS[i].chord)], ['bass', bassLine(CHORDS[i].root)],
    ['kick', DRUMS.kick], ['snare', i === 3 ? DRUMS.snareFill : DRUMS.snare], ['hat', DRUMS.hatBusy],
    ['lead', THEME_HIGH[i]],
  ],
  // Breakdown: the drums and bass drop out.
  (i) => [['pad', wholeBar(CHORDS[i].chord)], ['lead', THEME[i]]],
  // Everything back in.
  (i) => [
    ['pad', wholeBar(CHORDS[i].chord)], ['bass', bassLine(CHORDS[i].root)],
    ['kick', DRUMS.kick], ['snare', i === 3 ? DRUMS.snareFill : DRUMS.snare], ['hat', DRUMS.hatBusy],
    ['lead', THEME_HIGH[i]],
  ],
  // Outro: the chords over a half-time kick.
  (i) => [['pad', wholeBar(CHORDS[i].chord)], ['kick', DRUMS.kickHalf]],
];

const STEPS_PER_BAR = 16;

function arrange(): Score {
  const events: ScoreEvent[] = [];
  let bar = 0;
  for (const section of SECTIONS) {
    for (let i = 0; i < 4; i++, bar++) {
      for (const [part, pattern] of section(i)) {
        const parsed = parsePattern(pattern, HITS[part]);
        if (parsed.steps !== STEPS_PER_BAR) {
          throw new Error(`Bar ${bar + 1}, ${part}: ${parsed.steps} steps, not ${STEPS_PER_BAR}`);
        }
        events.push(...parsed.events.map((e) => ({ ...e, part, step: e.step + bar * STEPS_PER_BAR })));
      }
    }
  }
  return { bpm: BPM, length: bar * STEPS_PER_BAR, patches: PATCHES, events };
}

export const AFTERGLOW = arrange();
