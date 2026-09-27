import { describe, expect, it } from 'vitest';
import { START, currentTheme, respond } from './game';
import { ROOMS } from './rooms';
import type { Room } from './rooms';
import { ZONES } from './zones';

const rooms = ROOMS as Record<string, Room>;

function roomsIn(zone: string) {
  return Object.keys(rooms).filter((id) => rooms[id].zone === zone);
}

/** WCAG relative luminance of a #rrggbb colour. */
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** `fg` laid over `bg` at the given opacity, as #rrggbb. */
function blend(fg: string, bg: string, opacity: number) {
  return '#' + [1, 3, 5]
    .map((i) => Math.round(
      parseInt(fg.slice(i, i + 2), 16) * opacity + parseInt(bg.slice(i, i + 2), 16) * (1 - opacity),
    ).toString(16).padStart(2, '0'))
    .join('');
}

describe('zones', () => {
  it('each hold at least one room', () => {
    for (const zone of Object.keys(ZONES)) {
      expect(roomsIn(zone), zone).not.toHaveLength(0);
    }
  });

  it('give the BEDROOM and the SHUTTLE a zone of their own', () => {
    expect(roomsIn('BEDROOM')).toEqual(['BEDROOM']);
    expect(roomsIn('SHUTTLE')).toEqual(['SHUTTLE']);
  });

  it('are each one connected region, walkable without leaving the zone', () => {
    for (const zone of Object.keys(ZONES)) {
      const members = roomsIn(zone);
      const seen = new Set([members[0]]);
      const queue = [members[0]];
      while (queue.length) {
        for (const next of rooms[queue.shift()!].adjacent) {
          if (rooms[next].zone === zone && !seen.has(next)) {
            seen.add(next);
            queue.push(next);
          }
        }
      }
      expect([...seen].sort(), zone).toEqual(members.sort());
    }
  });

  it('use high-contrast colours: 7:1 for text, 4.5:1 for the dimmed echo', () => {
    for (const [zone, { fg, bg }] of Object.entries(ZONES)) {
      expect(contrast(fg, bg), zone).toBeGreaterThanOrEqual(7);
      // 0.7 matches the echo line's opacity in Terminal.tsx.
      expect(contrast(blend(fg, bg, 0.7), bg), `${zone} echo`).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('currentTheme', () => {
  it('follows the player from zone to zone', () => {
    expect(currentTheme(START)).toBe(ZONES.BEDROOM);

    let state = respond(START, 'walk CORRIDOR')!.state;
    expect(currentTheme(state)).toBe(ZONES.SHIP);

    for (const step of ['walk ENGINEERING', 'walk AIRLOCK', 'walk HANGAR', 'walk SHUTTLE']) {
      state = respond(state, step)!.state;
    }
    expect(currentTheme(state)).toBe(ZONES.SHUTTLE);

    state = respond(state, 'walk MARSPORT')!.state;
    expect(currentTheme(state)).toBe(ZONES.MARS);
  });
});
