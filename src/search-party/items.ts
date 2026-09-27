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
  CANDLESTICK: {
    description: 'a brass CANDLESTICK. Very old-fashioned for a starship.',
  },
  MOONSTONE: {
    description: 'a pale MOONSTONE, faintly glowing.',
  },
  PASSPORT: {
    description: 'a PASSPORT stamped by every port in the system.',
  },
  SPACEHELMET: {
    description: 'a dented SPACEHELMET. It still seals.',
  },
  TOWEL: {
    description: 'a fluffy TOWEL. Always know where yours is.',
  },
  FEDORA: {
    description: 'a red FEDORA. Its owner left in a hurry.',
  },
  RAYGUN: {
    description: 'a toy RAYGUN from the prize counter.',
  },
} satisfies Record<string, Item>;

export type ItemId = keyof typeof ITEMS;
