export type Item = {
  // Completes the sentence "You find ..."
  description: string;
};

// The key is the item's display name: uppercase, single token.
export const ITEMS = {
  ACCESSKEY: {
    description: 'an ACCESSKEY on a frayed lanyard.',
  },
} satisfies Record<string, Item>;

export type ItemId = keyof typeof ITEMS;
