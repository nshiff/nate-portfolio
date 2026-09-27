import { ITEMS } from './items';
import { ROOMS } from './rooms';
import type { Room } from './rooms';
import type { GameState } from './game';

export type Command = {
  // Returns the text to print, plus the new state if the command changed it.
  run: (state: GameState, arg: string) => { output: string; state?: GameState };
};

// The key is the command's name as typed, and doubles as its HELP entry.
export const COMMANDS: Record<string, Command> = {
  HELP: {
    run: () => ({ output: Object.keys(COMMANDS).sort().join('\t') }),
  },
  SEEK: {
    run: (state) => {
      const room: Room = ROOMS[state.room];
      const item = room.item;
      if (!item) {
        return { output: 'Your search turned up nothing.' };
      }
      if (state.found.includes(item)) {
        return { output: 'Nothing else to find here.' };
      }
      return {
        output: `You find ${ITEMS[item].description}`,
        state: { ...state, found: [...state.found, item] },
      };
    },
  },
  ITEMS: {
    run: (state) => ({
      output: state.found.length ? [...state.found].sort().join('\n') : 'No items found.',
    }),
  },
};
