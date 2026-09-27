export type Command = {
  run: (arg: string) => string;
};

// The key is the command's name as typed, and doubles as its HELP entry.
export const COMMANDS: Record<string, Command> = {
  HELP: {
    run: () => Object.keys(COMMANDS).sort().join('\t'),
  },
};
