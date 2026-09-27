import { describe, expect, it } from 'vitest';
import { INTRO, START, respond } from './game';
import type { GameState } from './game';
import { ITEMS } from './items';
import { ROOMS } from './rooms';
import type { Room } from './rooms';

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

const rooms: [string, Room][] = Object.entries(ROOMS);

describe('the map', () => {
  it('has 64 rooms and 10 items', () => {
    expect(rooms).toHaveLength(64);
    expect(Object.keys(ITEMS)).toHaveLength(10);
  });

  it('keeps every Adjacent line short enough for a phone', () => {
    for (const [id, room] of rooms) {
      expect(room.adjacent.length, id).toBeLessThanOrEqual(6);
    }
  });

  it('names every room and item with a single uppercase token', () => {
    for (const id of [...Object.keys(ROOMS), ...Object.keys(ITEMS)]) {
      expect(id).toMatch(/^[A-Z]+$/);
    }
  });

  it('links only to rooms that exist, never to itself, and on both sides', () => {
    for (const [id, room] of rooms) {
      for (const next of room.adjacent) {
        expect(next, `${id} -> ${next}`).not.toBe(id);
        expect(Object.keys(ROOMS), `${id} -> ${next}`).toContain(next);
        expect((ROOMS as Record<string, Room>)[next].adjacent, `${next} -> ${id}`).toContain(id);
      }
    }
  });

  it('gives the BEDROOM exactly one neighbour', () => {
    expect(ROOMS.BEDROOM.adjacent).toHaveLength(1);
  });

  it('can reach every room from the start', () => {
    const seen = new Set<string>([START.room]);
    const queue: string[] = [START.room];
    while (queue.length) {
      for (const next of (ROOMS as Record<string, Room>)[queue.shift()!].adjacent) {
        if (!seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      }
    }
    expect([...seen].sort()).toEqual(Object.keys(ROOMS).sort());
  });

  it('places every item in exactly one room', () => {
    const placed = rooms.map(([, room]) => room.item).filter(Boolean).sort();
    expect(placed).toEqual(Object.keys(ITEMS).sort());
  });
});

describe('INTRO', () => {
  it('welcomes the player, then describes the BEDROOM, its item, and its neighbour', () => {
    expect(INTRO).toBe(
      'Welcome! Run HELP to list available commands.\n\n' +
      'You find yourself in a tidy BEDROOM.\n\n' +
      'You find a worn index card containing a SECRETRECIPE.\n\n' +
      'Adjacent:\nCORRIDOR',
    );
  });
});

describe('respond', () => {
  it('lists the available commands for HELP, A-Z', () => {
    expect(play('HELP').output).toBe('HELP\tITEMS\tWALK');
  });

  it('matches command names case-insensitively and ignores surrounding space', () => {
    expect(play('help').output).toBe('HELP\tITEMS\tWALK');
    expect(play('  Help  ').output).toBe('HELP\tITEMS\tWALK');
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
    respond(START, 'walk CORRIDOR');
    expect(START).toEqual(before);
  });
});

describe('WALK', () => {
  it('asks for a room name when given none', () => {
    expect(play('walk').output).toBe('Try: WALK ROOMNAME');
  });

  it('moves to an adjacent room and describes it, neighbours A-Z', () => {
    const { state, output } = play('walk CORRIDOR');
    expect(state.room).toBe('CORRIDOR');
    expect(output).toBe(
      'A narrow CORRIDOR. The lights hum softly overhead.\n\n' +
      'Adjacent:\nBEDROOM, BRIDGE, ENGINEERING, GALLEY, TURBOLIFT',
    );
  });

  it('matches the room name case-insensitively', () => {
    expect(play('walk corridor').state.room).toBe('CORRIDOR');
  });

  it('refuses a room that is not adjacent, and stays put', () => {
    const { state, output } = play('walk BRIDGE');
    expect(output).toBe('Cannot walk to BRIDGE from here.');
    expect(state.room).toBe('BEDROOM');
  });

  it('refuses a room that does not exist', () => {
    expect(play('walk KITCHEN').output).toBe('Cannot walk to KITCHEN from here.');
  });

  it('refuses the room you are already in', () => {
    expect(play('walk BEDROOM').output).toBe('Cannot walk to BEDROOM from here.');
  });

  it('walks more than one step', () => {
    expect(play('walk CORRIDOR', 'walk GALLEY', 'walk HYDROPONICS').state.room).toBe('HYDROPONICS');
  });
});

describe('picking up items', () => {
  it('starts with the SECRETRECIPE from the BEDROOM', () => {
    expect(START.found).toEqual(['SECRETRECIPE']);
    expect(play('items').output).toBe('SECRETRECIPE');
  });

  it('picks up a room\'s item on the first visit, between description and neighbours', () => {
    const { state, output } = play('walk CORRIDOR', 'walk BRIDGE');
    expect(output).toBe(
      'The BRIDGE. Stars drift slowly past the viewscreen.\n\n' +
      'You find a folded STARCHART of an uncharted sector.\n\n' +
      'Adjacent:\nCOMMSROOM, CORRIDOR, OBSERVATORY',
    );
    expect(state.found).toEqual(['SECRETRECIPE', 'STARCHART']);
  });

  it('finds nothing new on a return visit', () => {
    const { state, output } = play('walk CORRIDOR', 'walk BRIDGE', 'walk CORRIDOR', 'walk BRIDGE');
    expect(output).not.toContain('You find');
    expect(state.found).toEqual(['SECRETRECIPE', 'STARCHART']);
  });

  it('says nothing about items in a room without one', () => {
    const { state, output } = play('walk CORRIDOR');
    expect(output).not.toContain('You find');
    expect(state.found).toEqual(['SECRETRECIPE']);
  });

  it('lists found items A-Z', () => {
    expect(play(
      'walk CORRIDOR', 'walk ENGINEERING',
      'walk CORRIDOR', 'walk BRIDGE',
      'items',
    ).output).toBe('PLASMAWRENCH\nSECRETRECIPE\nSTARCHART');
  });
});
