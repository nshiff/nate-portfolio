import { Instrument } from './instrument';
import type { Patch } from './instrument';

// A score is a list of note events on a grid of sixteenth-note steps, looped forever.
export type ScoreEvent = {
  part: string;
  step: number;
  // Length in steps.
  steps: number;
  // Several notes make a chord.
  notes: string[];
  velocity: number;
};

export type Score = {
  bpm: number;
  // Loop length in steps.
  length: number;
  patches: Record<string, Patch>;
  events: ScoreEvent[];
};

/**
 * Parse one pattern: whitespace-separated tokens, one per step.
 *   A4       a note          A3+C4+E4  a chord
 *   -        hold the last note one more step
 *   .        rest
 *   x / X    a hit / accented hit on `hit`, for drums
 */
export function parsePattern(pattern: string, hit = 'C4') {
  const tokens = pattern.trim().split(/\s+/);
  const events: Omit<ScoreEvent, 'part'>[] = [];
  let held: (typeof events)[number] | undefined;

  tokens.forEach((token, step) => {
    if (token === '-') {
      if (!held) {
        throw new Error(`Nothing to hold at step ${step}: ${pattern}`);
      }
      held.steps++;
      return;
    }
    if (token === '.') {
      held = undefined;
      return;
    }
    held =
      token === 'x' || token === 'X'
        ? { step, steps: 1, notes: [hit], velocity: token === 'X' ? 1 : 0.6 }
        : { step, steps: 1, notes: token.split('+'), velocity: 0.8 };
    events.push(held);
  });

  return { events, steps: tokens.length };
}

// How far ahead notes are handed to the audio clock. Generous, so a throttled
// background tab still keeps up; stopping silences anything already scheduled.
const LOOKAHEAD = 1.5;
const INTERVAL_MS = 50;

/** Play `score` into `output` from now, looping, until the returned function is called. */
export function perform(ctx: BaseAudioContext, output: AudioNode, score: Score) {
  const instruments = Object.fromEntries(
    Object.entries(score.patches).map(([part, patch]) => [part, new Instrument(ctx, output, patch)]),
  );
  const events = [...score.events].sort((a, b) => a.step - b.step);
  const stepSeconds = 60 / score.bpm / 4;
  const start = ctx.currentTime + 0.05;
  let next = 0;
  let loop = 0;

  function schedule() {
    const horizon = ctx.currentTime + LOOKAHEAD;
    while (events.length) {
      const event = events[next];
      const when = start + (loop * score.length + event.step) * stepSeconds;
      if (when > horizon) {
        break;
      }
      for (const note of event.notes) {
        instruments[event.part].play(note, when, event.steps * stepSeconds, event.velocity);
      }
      if (++next === events.length) {
        next = 0;
        loop++;
      }
    }
  }

  schedule();
  const timer = setInterval(schedule, INTERVAL_MS);
  return () => clearInterval(timer);
}
