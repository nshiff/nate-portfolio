import type { ItemId } from './items';

export type Room = {
  description: string;
  // What SEEK turns up here, if anything.
  item?: ItemId;
};

// The key is the room's display name: uppercase, single token.
export const ROOMS = {
  BEDROOM: {
    description: 'You find yourself in a tidy BEDROOM.',
    item: 'SECRETRECIPE',
  },
} satisfies Record<string, Room>;

export type RoomId = keyof typeof ROOMS;
