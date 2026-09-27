import { describe, expect, it } from 'vitest';
import { AFTERGLOW } from './composition';
import { noteFrequency } from './instrument';
import { QUIET, react } from './reactor';
import type { ReactorState } from './reactor';
import { parsePattern } from './score';
import { DEFAULT_PARAMS } from './visualizer';

describe('noteFrequency', () => {
  it('tunes A4 to 440 Hz, with octaves doubling', () => {
    expect(noteFrequency('A4')).toBe(440);
    expect(noteFrequency('A2')).toBeCloseTo(110);
    expect(noteFrequency('A5')).toBeCloseTo(880);
  });

  it('reads sharps and flats', () => {
    expect(noteFrequency('C4')).toBeCloseTo(261.63, 2);
    expect(noteFrequency('C#4')).toBeCloseTo(noteFrequency('Db4'));
    expect(noteFrequency('Bb3')).toBeCloseTo(233.08, 2);
  });

  it('rejects anything else', () => {
    expect(() => noteFrequency('H2')).toThrow('Not a note: H2');
  });
});

describe('parsePattern', () => {
  it('reads notes, holds and rests, one step per token', () => {
    const { events, steps } = parsePattern('A4 - - . C5 . E5 -');
    expect(steps).toBe(8);
    expect(events).toEqual([
      { step: 0, steps: 3, notes: ['A4'], velocity: 0.8 },
      { step: 4, steps: 1, notes: ['C5'], velocity: 0.8 },
      { step: 6, steps: 2, notes: ['E5'], velocity: 0.8 },
    ]);
  });

  it('reads chords', () => {
    expect(parsePattern('A3+C4+E4 -').events[0].notes).toEqual(['A3', 'C4', 'E4']);
  });

  it('plays drum hits on the given pitch, accented in caps', () => {
    expect(parsePattern('x . X', 'G1').events).toEqual([
      { step: 0, steps: 1, notes: ['G1'], velocity: 0.6 },
      { step: 2, steps: 1, notes: ['G1'], velocity: 1 },
    ]);
  });

  it('refuses a hold with nothing to hold', () => {
    expect(() => parsePattern('A4 . -')).toThrow('Nothing to hold at step 2');
  });
});

describe('Afterglow', () => {
  const stepSeconds = 60 / AFTERGLOW.bpm / 4;

  it('runs 28 bars, about a minute', () => {
    expect(AFTERGLOW.length).toBe(28 * 16);
    expect(AFTERGLOW.length * stepSeconds).toBeCloseTo(60, 0);
  });

  it('only plays real notes, on parts that have a patch, inside the loop', () => {
    for (const event of AFTERGLOW.events) {
      expect(AFTERGLOW.patches).toHaveProperty([event.part]);
      expect(event.step + event.steps).toBeLessThanOrEqual(AFTERGLOW.length);
      for (const note of event.notes) {
        expect(() => noteFrequency(note)).not.toThrow();
      }
    }
  });

  it('gives every part something to play', () => {
    const parts = new Set(AFTERGLOW.events.map((e) => e.part));
    expect([...parts].sort()).toEqual(Object.keys(AFTERGLOW.patches).sort());
  });
});

describe('react', () => {
  const FRAME = 1 / 60;

  /** Feed the reactor a run of frames, returning the final state and how many beats it heard. */
  function listen(frames: { rms: number; bass: number }[], state: ReactorState = QUIET) {
    let beats = 0;
    let params = DEFAULT_PARAMS;
    for (const levels of frames) {
      const result = react(state, levels, FRAME);
      state = result.state;
      params = result.params;
      beats += result.beat ? 1 : 0;
    }
    return { state, params, beats };
  }

  const silence = (n: number) => Array.from({ length: n }, () => ({ rms: 0, bass: 0 }));

  it('draws the resting look in silence', () => {
    expect(listen(silence(60)).params).toEqual(DEFAULT_PARAMS);
  });

  it('hears a bass hit as a beat that kicks the curves outward, then settles', () => {
    const hit = listen([...silence(30), { rms: 0.3, bass: 0.8 }]);
    expect(hit.beats).toBe(1);
    expect(hit.params.spread).toBeGreaterThan(DEFAULT_PARAMS.spread);
    expect(hit.params.speed).toBeGreaterThan(DEFAULT_PARAMS.speed);

    const after = listen(silence(120), hit.state);
    expect(after.params.spread).toBeCloseTo(DEFAULT_PARAMS.spread, 3);
  });

  it('hears a steady drone as one beat, not many', () => {
    const drone = Array.from({ length: 180 }, () => ({ rms: 0.3, bass: 0.7 }));
    expect(listen(drone).beats).toBe(1);
  });

  it('counts a kick on every beat at 112 BPM', () => {
    // Two seconds of a kick every 32 frames (about 112 BPM), 4 frames long.
    const frames = Array.from({ length: 128 }, (_, i) =>
      i % 32 < 4 ? { rms: 0.4, bass: 0.8 } : { rms: 0.1, bass: 0.3 },
    );
    expect(listen(frames).beats).toBe(4);
  });

  it('draws thicker lines when loud', () => {
    const loud = Array.from({ length: 30 }, () => ({ rms: 0.3, bass: 0 }));
    expect(listen(loud).params.lineWidth).toBeGreaterThan(DEFAULT_PARAMS.lineWidth + 2);
  });
});
