import type { ItemId } from './items';

export type Room = {
  description: string;
  // Neighbouring room ids. Symmetric: list the link on both sides.
  adjacent: string[];
  // What SEEK turns up here, if anything.
  item?: ItemId;
};

// The key is the room's display name: uppercase, single token.
export const ROOMS = {
  BEDROOM: {
    description: 'You find yourself in a tidy BEDROOM.',
    adjacent: ['CORRIDOR'],
    item: 'SECRETRECIPE',
  },
  CORRIDOR: {
    description: 'A narrow CORRIDOR. The lights hum softly overhead.',
    adjacent: ['BEDROOM', 'BRIDGE', 'GALLEY', 'ENGINEERING'],
  },
  BRIDGE: {
    description: 'The BRIDGE. Stars drift slowly past the viewscreen.',
    adjacent: ['CORRIDOR'],
    item: 'STARCHART',
  },
  GALLEY: {
    description: 'A compact GALLEY. Something smells delicious.',
    adjacent: ['CORRIDOR', 'HYDROPONICS'],
  },
  HYDROPONICS: {
    description: 'The HYDROPONICS bay. Tomatoes glow under violet lamps.',
    adjacent: ['GALLEY'],
  },
  ENGINEERING: {
    description: 'ENGINEERING. The reactor thrums steadily.',
    adjacent: ['CORRIDOR'],
    item: 'PLASMAWRENCH',
  },
} satisfies Record<string, Room>;

export type RoomId = keyof typeof ROOMS;

export function isRoomId(id: string): id is RoomId {
  return Object.hasOwn(ROOMS, id);
}

/** A room's description followed by its neighbours, A-Z. */
export function describeRoom(id: RoomId) {
  const room: Room = ROOMS[id];
  return `${room.description}\n\nAdjacent:\n${[...room.adjacent].sort().join(', ')}`;
}
