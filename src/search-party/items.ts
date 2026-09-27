export type Item = {
  // Completes the sentence "You find ..."
  description: string;
};

// The key is the item's display name: uppercase, single token.
export const ITEMS = {
  SECRETRECIPE: {
    description: 'a worn index card containing a SECRETRECIPE.',
  },
  STARCHART: {
    description: 'a folded STARCHART of an uncharted sector.',
  },
  PLASMAWRENCH: {
    description: 'a scuffed PLASMAWRENCH, still warm.',
  },
} satisfies Record<string, Item>;

export type ItemId = keyof typeof ITEMS;
