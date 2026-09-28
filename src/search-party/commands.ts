import { ROOMS, enterRoom, isRoomId } from './rooms';
import type { Room } from './rooms';
import type { GameState } from './game';

export type Command = {
  // Returns the text to print, plus the new state if the command changed it.
  run: (state: GameState, arg: string) => { output: string; state?: GameState };
};

// The key is the command's name as typed, and doubles as its HELP entry.
export const COMMANDS: Record<string, Command> = {
  ABOUT: {
    run: () => ({
      output:
        'Search Party 2.0\n' +
        'A Zork-like game in React and TypeScript inspired by the original Search Party.',
    }),
  },
  HELP: {
    run: () => ({ output: Object.keys(COMMANDS).sort().join('\t') }),
  },
  WALK: {
    run: (state, arg) => {
      const target = arg.trim().toUpperCase();
      if (!target) {
        return { output: 'Try: WALK ROOMNAME' };
      }
      const room: Room = ROOMS[state.room];
      if (!isRoomId(target) || !room.adjacent.includes(target)) {
        return { output: `Cannot walk to ${target} from here.` };
      }
      return enterRoom(state, target);
    },
  },
  ITEMS: {
    run: (state) => ({
      output: state.found.length ? [...state.found].sort().join('\n') : 'No items found.',
    }),
  },
};
