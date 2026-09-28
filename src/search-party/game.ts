import { COMMANDS } from './commands';
import type { ItemId } from './items';
import { ROOMS, enterRoom } from './rooms';
import type { RoomId } from './rooms';
import { ZONES } from './zones';

export type GameState = {
  room: RoomId;
  found: ItemId[];
};

// Starting the game counts as entering the BEDROOM, so any item there is picked up at once.
const opening = enterRoom({ room: 'BEDROOM', found: [] }, 'BEDROOM');

export const START: GameState = opening.state;

export const INTRO = `Welcome! Run HELP to list available commands.\n\n${opening.output}`;

/** The terminal colours for the zone the player is in. */
export function currentTheme(state: GameState) {
  return ZONES[ROOMS[state.room].zone];
}

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
