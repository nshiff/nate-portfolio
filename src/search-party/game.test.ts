import { describe, expect, it } from 'vitest';
import { INTRO, START, respond } from './game';
import type { GameState } from './game';

/** Run a sequence of inputs from START, returning the final state and the last output. */
function play(...inputs: string[]) {
  let state: GameState = START;
  let output: string | undefined;
  for (const input of inputs) {
    const result = respond(state, input);
    if (result) {
      state = result.state;
      output = result.output;
    }
  }
  return { state, output };
}

describe('INTRO', () => {
  it('welcomes the player, then describes the BEDROOM', () => {
    expect(INTRO).toBe(
      'Welcome! Run HELP to list available commands.\n\nYou find yourself in a tidy BEDROOM.',
    );
  });
});

describe('respond', () => {
  it('lists the available commands for HELP, A-Z', () => {
    expect(play('HELP').output).toBe('HELP\tITEMS\tSEEK');
  });

  it('matches command names case-insensitively and ignores surrounding space', () => {
    expect(play('help').output).toBe('HELP\tITEMS\tSEEK');
    expect(play('  Help  ').output).toBe('HELP\tITEMS\tSEEK');
  });

  it('reports an unknown command in caps, with the HELP tip', () => {
    expect(play('teleport forest').output).toBe(
      'Unknown command: TELEPORT FOREST.\nRun HELP to list available commands.',
    );
  });

  it('returns null for blank input', () => {
    expect(respond(START, '')).toBeNull();
    expect(respond(START, '   ')).toBeNull();
  });

  it('never mutates the state it is given', () => {
    const before = structuredClone(START);
    respond(START, 'seek');
    expect(START).toEqual(before);
  });
});

describe('SEEK and ITEMS', () => {
  it('starts with no items', () => {
    expect(play('items').output).toBe('No items found.');
  });

  it('finds the SECRETRECIPE in the BEDROOM', () => {
    const { state, output } = play('seek');
    expect(output).toBe('You found a worn index card containing a SECRETRECIPE.');
    expect(state.found).toEqual(['SECRETRECIPE']);
  });

  it('finds an item only once', () => {
    const { state, output } = play('seek', 'seek');
    expect(output).toBe('Nothing else to find here.');
    expect(state.found).toEqual(['SECRETRECIPE']);
  });

  it('lists found items', () => {
    expect(play('seek', 'items').output).toBe('SECRETRECIPE');
  });
});
