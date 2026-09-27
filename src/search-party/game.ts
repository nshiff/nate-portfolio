import { COMMANDS } from './commands';

export const WELCOME = 'Welcome! Run HELP to list available commands.';

/** Turn one line of player input into the text to print, or null for blank input. */
export function respond(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  const [name, ...rest] = trimmed.split(/\s+/);
  const command = COMMANDS[name.toUpperCase()];
  if (!command) {
    return `Unknown command: ${trimmed.toUpperCase()}.\nRun HELP to list available commands.`;
  }
  return command.run(rest.join(' '));
}
