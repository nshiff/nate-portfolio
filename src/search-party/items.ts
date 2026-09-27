export type Item = {
  // Completes the sentence "You find ..."
  description: string;
};

// The key is the item's display name: uppercase, single token.
export const ITEMS = {
  SECRETRECIPE: {
    description: 'a worn index card containing a SECRETRECIPE. Looks appetizing!',
  },
} satisfies Record<string, Item>;

export type ItemId = keyof typeof ITEMS;
