import type { TerminalTheme } from './Terminal';

// Each zone always shows the same terminal colours, so the player can feel
// the world change as they cross into it.
export const ZONES = {
  QUARTERS: { fg: '#33ff66', bg: '#0a0a0a' }, // green on black
  HOMEBASE: { fg: '#ffffff', bg: '#0a0a0a' }, // white on black
  WEIRDPORTAL: { fg: '#d4d0ff', bg: '#352879' }, // Commodore 64 blues
  MOON: { fg: '#1c1c1c', bg: '#d6d6d0' },     // graphite on moon-dust grey
  MARS: { fg: '#fff4ec', bg: '#5c0a0a' },     // white on dark red
  EUROPA: { fg: '#bff4ff', bg: '#0b2233' },   // ice on deep navy
  TITAN: { fg: '#ffb02e', bg: '#0a0a0a' },    // amber on black
  STATION: { fg: '#ff8ad8', bg: '#1e0b33' },  // neon pink on purple
} satisfies Record<string, TerminalTheme>;

export type ZoneId = keyof typeof ZONES;
