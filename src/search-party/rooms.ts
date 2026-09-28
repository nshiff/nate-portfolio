import { ITEMS } from './items';
import type { ItemId } from './items';
import type { GameState } from './game';
import type { ZoneId } from './zones';

export type Room = {
  description: string;
  // Sets the terminal's colours while the player is here.
  zone: ZoneId;
  // Neighbouring room ids. Symmetric: list the link on both sides.
  adjacent: string[];
  // Picked up automatically the first time the player enters.
  item?: ItemId;
};

// The key is the room's display name: uppercase, single token.
export const ROOMS = {
  BEDROOM: {
    description: 'You find yourself in a tidy BEDROOM.',
    zone: 'QUARTERS',
    adjacent: ['LIVINGROOM'],
  },
  LIVINGROOM: {
    description: 'A geometric rug adorns the LIVINGROOM.',
    zone: 'QUARTERS',
    adjacent: ['BEDROOM', 'HALLWAY'],
  },

  // --- The ship ---
  HALLWAY: {
    description: 'A HALLWAY lit by fluorescent lights.',
    zone: 'SHIP',
    adjacent: ['LIVINGROOM', 'GALLEY', 'HANGAR'],
  },
  GALLEY: {
    description: 'A compact GALLEY. Something smells delicious.',
    zone: 'SHIP',
    adjacent: ['HALLWAY'],
    item: 'SECRETRECIPE',
  },
  HANGAR: {
    description: 'A busy HANGAR. A SHUTTLE waits, engines warm.',
    zone: 'SHIP',
    adjacent: ['HALLWAY', 'SHUTTLE'],
  },
  SHUTTLE: {
    description: 'A small SHUTTLE. The console blinks patiently.',
    zone: 'SHUTTLE',
    adjacent: ['HANGAR'],
  },
} satisfies Record<string, Room>;

export type RoomId = keyof typeof ROOMS;

export function isRoomId(id: string): id is RoomId {
  return Object.hasOwn(ROOMS, id);
}

/**
 * Move the player into a room: describe it, pick up its item if not yet found,
 * then list its neighbours, A-Z.
 */
export function enterRoom(state: GameState, id: RoomId) {
  const room: Room = ROOMS[id];
  const item = room.item && !state.found.includes(room.item) ? room.item : undefined;

  const output = [room.description];
  if (item) {
    output.push(`You find ${ITEMS[item].description}`);
  }
  output.push(`Adjacent:\n${[...room.adjacent].sort().join(', ')}`);

  return {
    output: output.join('\n\n'),
    state: { room: id, found: item ? [...state.found, item] : state.found },
  };
}
