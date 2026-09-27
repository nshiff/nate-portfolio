import { useState } from 'react';
import { Terminal } from './Terminal';
import { INTRO, START, currentTheme, respond } from './game';

/** Search Party 2.0: holds the game state and feeds each command through the game. */
export function SearchParty2() {
  const [game, setGame] = useState(START);

  function handleCommand(input: string) {
    const result = respond(game, input);
    if (!result) {
      return null;
    }
    setGame(result.state);
    return result.output;
  }

  return <Terminal intro={INTRO} onCommand={handleCommand} theme={currentTheme(game)} />;
}
