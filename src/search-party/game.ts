import { COMMANDS } from './commands';
import type { ItemId } from './items';
import { ROOMS } from './rooms';
import type { RoomId } from './rooms';

export type GameState = {
  room: RoomId;
  found: ItemId[];
};

export const START: GameState = {
  room: 'BEDROOM',
  found: [],
};

export const INTRO = `Welcome! Run HELP to list available commands.\n\n${ROOMS[START.room].description}`;

/**
 * Turn one line of player input into the text to print and the state that follows.
 * Returns null for blank input. Never mutates `state`.
 */
export function respond(state: GameState, raw: string): { output: string; state: GameState } | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  const [name, ...rest] = trimmed.split(/\s+/);
  const command = COMMANDS[name.toUpperCase()];
  if (!command) {
    return {
      output: `Unknown command: ${trimmed.toUpperCase()}.\nRun HELP to list available commands.`,
      state,
    };
  }
  const result = command.run(state, rest.join(' '));
  return { output: result.output, state: result.state ?? state };
}
