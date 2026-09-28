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
  it('has 6 rooms and 1 item', () => {
    expect(rooms).toHaveLength(6);
    expect(Object.keys(ITEMS)).toHaveLength(1);
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
  it('welcomes the player, then describes the BEDROOM and its neighbour', () => {
    expect(INTRO).toBe(
      'Welcome! Run HELP to list available commands.\n\n' +
      'You find yourself in a tidy BEDROOM.\n\n' +
      'Adjacent:\nLIVINGROOM',
    );
  });
});

describe('respond', () => {
  it('lists the available commands for HELP, A-Z', () => {
    expect(play('HELP').output).toBe('ABOUT\tHELP\tITEMS\tWALK');
  });

  it('matches command names case-insensitively and ignores surrounding space', () => {
    expect(play('help').output).toBe('ABOUT\tHELP\tITEMS\tWALK');
    expect(play('  Help  ').output).toBe('ABOUT\tHELP\tITEMS\tWALK');
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
    respond(START, 'walk LIVINGROOM');
    expect(START).toEqual(before);
  });
});

describe('WALK', () => {
  it('asks for a room name when given none', () => {
    expect(play('walk').output).toBe('Try: WALK ROOMNAME');
  });

  it('moves to an adjacent room and describes it, neighbours A-Z', () => {
    const { state, output } = play('walk LIVINGROOM');
    expect(state.room).toBe('LIVINGROOM');
    expect(output).toBe(
      'A cozy LIVINGROOM. A sofa faces a wide window.\n\n' +
      'Adjacent:\nBEDROOM, HALLWAY',
    );
  });

  it('matches the room name case-insensitively', () => {
    expect(play('walk livingroom').state.room).toBe('LIVINGROOM');
  });

  it('walks back the way it came', () => {
    expect(play('walk LIVINGROOM', 'walk BEDROOM').state.room).toBe('BEDROOM');
  });

  it('walks more than one step', () => {
    expect(play('walk LIVINGROOM', 'walk HALLWAY').state.room).toBe('HALLWAY');
  });

  it('refuses a room that is not adjacent, and stays put', () => {
    const { state, output } = play('walk HALLWAY');
    expect(output).toBe('Cannot walk to HALLWAY from here.');
    expect(state.room).toBe('BEDROOM');
  });

  it('refuses a room that does not exist', () => {
    expect(play('walk KITCHEN').output).toBe('Cannot walk to KITCHEN from here.');
  });

  it('refuses the room you are already in', () => {
    expect(play('walk BEDROOM').output).toBe('Cannot walk to BEDROOM from here.');
  });
});

describe('picking up items', () => {
  it('starts empty', () => {
    expect(START.found).toEqual([]);
    expect(play('items').output).toBe('No items found.');
  });

  it('picks up a room\'s item on the first visit, between description and neighbours', () => {
    const { state, output } = play('walk LIVINGROOM', 'walk HALLWAY', 'walk GALLEY');
    expect(output).toBe(
      'A compact GALLEY. Something smells delicious.\n\n' +
      'You find a worn index card containing a SECRETRECIPE.\n\n' +
      'Adjacent:\nHALLWAY',
    );
    expect(state.found).toEqual(['SECRETRECIPE']);
  });

  it('finds nothing new on a return visit', () => {
    const { state, output } = play(
      'walk LIVINGROOM', 'walk HALLWAY', 'walk GALLEY', 'walk HALLWAY', 'walk GALLEY',
    );
    expect(output).not.toContain('You find');
    expect(state.found).toEqual(['SECRETRECIPE']);
  });

  it('says nothing about items in a room without one', () => {
    const { state, output } = play('walk LIVINGROOM', 'walk HALLWAY');
    expect(output).not.toContain('You find');
    expect(state.found).toEqual([]);
  });

  it('lists found items', () => {
    expect(play('walk LIVINGROOM', 'walk HALLWAY', 'walk GALLEY', 'items').output).toBe('SECRETRECIPE');
  });
});
