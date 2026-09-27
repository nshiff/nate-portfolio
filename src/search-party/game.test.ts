import { describe, expect, it } from 'vitest';
import { respond } from './game';

describe('respond', () => {
  it('lists the available commands for HELP', () => {
    expect(respond('HELP')).toBe('HELP');
  });

  it('matches command names case-insensitively and ignores surrounding space', () => {
    expect(respond('help')).toBe('HELP');
    expect(respond('  Help  ')).toBe('HELP');
  });

  it('reports an unknown command in caps, with the HELP tip', () => {
    expect(respond('teleport forest')).toBe(
      'Unknown command: TELEPORT FOREST.\nRun HELP to list available commands.',
    );
  });

  it('returns null for blank input', () => {
    expect(respond('')).toBeNull();
    expect(respond('   ')).toBeNull();
  });
});
