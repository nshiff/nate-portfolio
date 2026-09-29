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

  // --- The homebase ---
  HALLWAY: {
    description: 'A HALLWAY lit by fluorescent lights.',
    zone: 'HOMEBASE',
    adjacent: ['LIVINGROOM', 'GALLEY', 'HANGAR'],
  },
  GALLEY: {
    description: 'A compact GALLEY. Something smells delicious.',
    zone: 'HOMEBASE',
    adjacent: ['HALLWAY'],
    item: 'SECRETRECIPE',
  },
  HANGAR: {
    description: 'A busy HANGAR with several shuttles and ... something else.',
    zone: 'HOMEBASE',
    adjacent: ['HALLWAY', 'WEIRDPORTAL'],
  },
  WEIRDPORTAL: {
    description: 'You just walked into a WEIRDPORTAL. Better not dilly dally, I suppose.',
    zone: 'WEIRDPORTAL',
    adjacent: ['HANGAR', 'SPACEDECK', 'MARSBASE'],
    item: 'SHINYCOIN',
  },

  // --- Europa ---
  SPACEDECK: {
    description: 'A chilly SPACEDECK. Jupiter fills half the sky.',
    zone: 'EUROPA',
    adjacent: ['WEIRDPORTAL', 'ICETUNNEL'],
  },
  ICETUNNEL: {
    description: 'A narrow ICETUNNEL. The walls glow a faint blue.',
    zone: 'EUROPA',
    adjacent: ['SPACEDECK', 'DRILLSITE'],
  },
  DRILLSITE: {
    description: 'A noisy DRILLSITE. The ocean lies somewhere below.',
    zone: 'EUROPA',
    adjacent: ['ICETUNNEL'],
  },

  // --- Mars ---
  MARSBASE: {
    description: 'A dusty MARSBASE. Red sand piles against every window.',
    zone: 'MARS',
    adjacent: ['WEIRDPORTAL', 'GREENHOUSE', 'ROVERBAY'],
  },
  GREENHOUSE: {
    description: 'A warm GREENHOUSE. Potato plants fill every bench.',
    zone: 'MARS',
    adjacent: ['MARSBASE'],
  },
  ROVERBAY: {
    description: 'A cluttered ROVERBAY. One rover is missing a wheel.',
    zone: 'MARS',
    adjacent: ['MARSBASE'],
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
