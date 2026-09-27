import { ITEMS } from './items';
import type { ItemId } from './items';
import type { GameState } from './game';

export type Room = {
  description: string;
  // Neighbouring room ids. Symmetric: list the link on both sides.
  adjacent: string[];
  // Picked up automatically the first time the player enters.
  item?: ItemId;
};

// The key is the room's display name: uppercase, single token.
export const ROOMS = {
  // --- The ship ---
  BEDROOM: {
    description: 'You find yourself in a tidy BEDROOM.',
    adjacent: ['CORRIDOR'],
    item: 'SECRETRECIPE',
  },
  CORRIDOR: {
    description: 'A narrow CORRIDOR. The lights hum softly overhead.',
    adjacent: ['BEDROOM', 'BRIDGE', 'GALLEY', 'ENGINEERING', 'TURBOLIFT'],
  },
  BRIDGE: {
    description: 'The BRIDGE. Stars drift slowly past the viewscreen.',
    adjacent: ['CORRIDOR', 'COMMSROOM', 'OBSERVATORY'],
    item: 'STARCHART',
  },
  COMMSROOM: {
    description: 'The COMMSROOM. Static crackles on every channel.',
    adjacent: ['BRIDGE'],
  },
  OBSERVATORY: {
    description: 'The OBSERVATORY. A telescope points at a distant nebula.',
    adjacent: ['BRIDGE', 'CONSERVATORY'],
  },
  GALLEY: {
    description: 'A compact GALLEY. Something smells delicious.',
    adjacent: ['CORRIDOR', 'HYDROPONICS', 'DININGROOM', 'STUDY'],
  },
  HYDROPONICS: {
    description: 'The HYDROPONICS bay. Tomatoes glow under violet lamps.',
    adjacent: ['GALLEY', 'CONSERVATORY'],
  },
  CONSERVATORY: {
    description: 'A glass CONSERVATORY. Alien ferns curl toward the stars.',
    adjacent: ['HYDROPONICS', 'OBSERVATORY', 'LOUNGE'],
  },
  DININGROOM: {
    description: 'A long DININGROOM. Six places are set for dinner.',
    adjacent: ['GALLEY', 'BALLROOM', 'LOUNGE'],
  },
  LOUNGE: {
    description: 'A plush LOUNGE. A hidden passage leads to the CONSERVATORY.',
    adjacent: ['DININGROOM', 'CONSERVATORY'],
  },
  BALLROOM: {
    description: 'A zero-gravity BALLROOM. The chandelier floats gently.',
    adjacent: ['DININGROOM', 'BILLIARDROOM', 'TURBOLIFT'],
  },
  BILLIARDROOM: {
    description: 'The BILLIARDROOM. The balls hover above the table.',
    adjacent: ['BALLROOM', 'LIBRARY'],
  },
  LIBRARY: {
    description: 'A quiet LIBRARY. Paper books, of all things.',
    adjacent: ['BILLIARDROOM', 'STUDY'],
    item: 'CANDLESTICK',
  },
  STUDY: {
    description: 'A cramped STUDY. A hidden passage leads to the GALLEY.',
    adjacent: ['LIBRARY', 'GALLEY'],
  },
  TURBOLIFT: {
    description: 'The TURBOLIFT. It asks politely which deck.',
    adjacent: ['CORRIDOR', 'BALLROOM', 'MEDBAY', 'GYMNASIUM', 'CARGOHOLD'],
  },
  MEDBAY: {
    description: 'The MEDBAY. A robot doctor waits patiently.',
    adjacent: ['TURBOLIFT'],
  },
  GYMNASIUM: {
    description: 'A small GYMNASIUM. The treadmill faces a window of stars.',
    adjacent: ['TURBOLIFT', 'LAUNDRY'],
  },
  LAUNDRY: {
    description: 'The LAUNDRY. One sock is missing, as always.',
    adjacent: ['GYMNASIUM'],
  },
  CARGOHOLD: {
    description: 'The CARGOHOLD. Crates are stacked to the ceiling.',
    adjacent: ['TURBOLIFT', 'BRIG', 'HANGAR'],
  },
  BRIG: {
    description: 'An empty BRIG. The cell door hangs open.',
    adjacent: ['CARGOHOLD'],
  },
  ENGINEERING: {
    description: 'ENGINEERING. The reactor thrums steadily.',
    adjacent: ['CORRIDOR', 'AIRLOCK'],
    item: 'PLASMAWRENCH',
  },
  AIRLOCK: {
    description: 'The AIRLOCK. The outer door stays firmly shut.',
    adjacent: ['ENGINEERING', 'HANGAR'],
  },
  HANGAR: {
    description: 'A busy HANGAR. A SHUTTLE waits, engines warm.',
    adjacent: ['AIRLOCK', 'CARGOHOLD', 'SHUTTLE'],
  },
  SHUTTLE: {
    description: 'A small SHUTTLE. Destinations blink on the console.',
    adjacent: ['HANGAR', 'MOONPORT', 'MARSPORT', 'EUROPAPORT', 'TITANPORT', 'DOCKINGRING'],
  },

  // --- The Moon ---
  MOONPORT: {
    description: 'The MOONPORT. Earth hangs low on the horizon.',
    adjacent: ['SHUTTLE', 'MOONBASE', 'TRANQUILITY'],
  },
  MOONBASE: {
    description: 'The MOONBASE. Everything here is a little dusty.',
    adjacent: ['MOONPORT', 'HELIUMMINE', 'MOONHOTEL'],
  },
  HELIUMMINE: {
    description: 'A HELIUMMINE. Drills whir in the dark.',
    adjacent: ['MOONBASE'],
  },
  MOONHOTEL: {
    description: 'The MOONHOTEL. Every room has an Earth view.',
    adjacent: ['MOONBASE'],
  },
  TRANQUILITY: {
    description: 'The Sea of TRANQUILITY. Old footprints lead away.',
    adjacent: ['MOONPORT', 'CRATER', 'GOLFCOURSE'],
  },
  GOLFCOURSE: {
    description: 'A lunar GOLFCOURSE. Two old golf balls lie nearby.',
    adjacent: ['TRANQUILITY'],
  },
  CRATER: {
    description: 'A deep CRATER. The rim is sharp against the stars.',
    adjacent: ['TRANQUILITY', 'FARSIDE'],
  },
  FARSIDE: {
    description: 'The FARSIDE of the moon. It is very quiet here.',
    adjacent: ['CRATER'],
    item: 'MOONSTONE',
  },

  // --- Mars ---
  MARSPORT: {
    description: 'The MARSPORT. The sky is a dusty pink.',
    adjacent: ['SHUTTLE', 'COLONYDOME', 'REDDESERT'],
    item: 'PASSPORT',
  },
  COLONYDOME: {
    description: 'A bustling COLONYDOME. Everyone here was born somewhere else.',
    adjacent: ['MARSPORT', 'POTATOFARM', 'ROVERGARAGE'],
  },
  POTATOFARM: {
    description: 'A POTATOFARM. Someone grew these the hard way.',
    adjacent: ['COLONYDOME'],
  },
  ROVERGARAGE: {
    description: 'The ROVERGARAGE. A little rover blinks hello.',
    adjacent: ['COLONYDOME'],
  },
  REDDESERT: {
    description: 'A vast REDDESERT. Rusty dunes stretch on forever.',
    adjacent: ['MARSPORT', 'MARINERIS', 'OLYMPUSMONS'],
  },
  OLYMPUSMONS: {
    description: 'OLYMPUSMONS. The tallest mountain you have ever seen.',
    adjacent: ['REDDESERT'],
  },
  MARINERIS: {
    description: 'The MARINERIS canyon. It could swallow a continent.',
    adjacent: ['REDDESERT', 'POLARCAP'],
  },
  POLARCAP: {
    description: 'The POLARCAP. Dry ice crunches underfoot.',
    adjacent: ['MARINERIS'],
  },

  // --- Europa ---
  EUROPAPORT: {
    description: 'The EUROPAPORT. Jupiter fills half the sky.',
    adjacent: ['SHUTTLE', 'ICESHELF', 'RESEARCHLAB'],
  },
  RESEARCHLAB: {
    description: 'A RESEARCHLAB. Every sample is labelled carefully.',
    adjacent: ['EUROPAPORT', 'AQUARIUM'],
  },
  AQUARIUM: {
    description: 'An AQUARIUM. Something small and glowing swims by.',
    adjacent: ['RESEARCHLAB'],
  },
  ICESHELF: {
    description: 'The ICESHELF. It groans and creaks beneath you.',
    adjacent: ['EUROPAPORT', 'ICECAVE', 'DRILLSITE'],
  },
  ICECAVE: {
    description: 'A blue ICECAVE. Your breath hangs in the air.',
    adjacent: ['ICESHELF'],
  },
  DRILLSITE: {
    description: 'The DRILLSITE. The bore hole reaches the ocean below.',
    adjacent: ['ICESHELF', 'SUBMARINE'],
    item: 'SPACEHELMET',
  },
  SUBMARINE: {
    description: 'A tiny SUBMARINE. Portholes look out on dark water.',
    adjacent: ['DRILLSITE', 'OCEANFLOOR'],
  },
  OCEANFLOOR: {
    description: 'The OCEANFLOOR. Warm vents bubble in the dark.',
    adjacent: ['SUBMARINE'],
  },

  // --- Titan ---
  TITANPORT: {
    description: 'The TITANPORT. An orange haze hides the sun.',
    adjacent: ['SHUTTLE', 'DUNES', 'METHANELAKE'],
  },
  DUNES: {
    description: 'Dark DUNES. The grains are frozen hydrocarbons.',
    adjacent: ['TITANPORT', 'WEATHERSTATION', 'LANDERSITE'],
  },
  WEATHERSTATION: {
    description: 'A WEATHERSTATION. The forecast is methane rain.',
    adjacent: ['DUNES'],
  },
  LANDERSITE: {
    description: 'An old LANDERSITE. A small probe rests where it fell.',
    adjacent: ['DUNES'],
  },
  METHANELAKE: {
    description: 'A calm METHANELAKE. It is far too cold to swim.',
    adjacent: ['TITANPORT', 'BOATHOUSE', 'SHORELINE'],
  },
  BOATHOUSE: {
    description: 'A BOATHOUSE. The little boat is built for methane seas.',
    adjacent: ['METHANELAKE'],
    item: 'TOWEL',
  },
  SHORELINE: {
    description: 'A misty SHORELINE. Pebbles of ice line the shore.',
    adjacent: ['METHANELAKE', 'CRYOVOLCANO'],
  },
  CRYOVOLCANO: {
    description: 'A CRYOVOLCANO. It erupts with slush instead of lava.',
    adjacent: ['SHORELINE'],
  },

  // --- The ring station ---
  DOCKINGRING: {
    description: 'The DOCKINGRING. Ships from every world come and go.',
    adjacent: ['SHUTTLE', 'PROMENADE'],
  },
  PROMENADE: {
    description: 'The PROMENADE. Travelers chatter in a dozen languages.',
    adjacent: ['DOCKINGRING', 'BAZAAR', 'CANTINA', 'MUSEUM', 'ARCADE'],
  },
  BAZAAR: {
    description: 'A crowded BAZAAR. Merchants sell spices from six moons.',
    adjacent: ['PROMENADE', 'EMBASSY'],
  },
  EMBASSY: {
    description: 'An EMBASSY. A notice warns of a thief in a red coat.',
    adjacent: ['BAZAAR'],
  },
  CANTINA: {
    description: 'A dim CANTINA. The band only knows one song.',
    adjacent: ['PROMENADE', 'CASINO'],
  },
  CASINO: {
    description: 'A glittering CASINO. The house always wins.',
    adjacent: ['CANTINA'],
  },
  MUSEUM: {
    description: 'The MUSEUM. One display case sits empty.',
    adjacent: ['PROMENADE'],
    item: 'FEDORA',
  },
  ARCADE: {
    description: 'A noisy ARCADE. Someone holds the high score on every machine.',
    adjacent: ['PROMENADE'],
    item: 'RAYGUN',
  },
} satisfies Record<string, Room>;

export type RoomId = keyof typeof ROOMS;

export function isRoomId(id: string): id is RoomId {
  return Object.hasOwn(ROOMS, id);
}

/**
 * Move the player into a room: describe it, pick up its item if not yet found,
 * then list its neighbours, A-Z.
 */
export function enterRoom(state: GameState, id: RoomId) {
  const room: Room = ROOMS[id];
  const item = room.item && !state.found.includes(room.item) ? room.item : undefined;

  const output = [room.description];
  if (item) {
    output.push(`You find ${ITEMS[item].description}`);
  }
  output.push(`Adjacent:\n${[...room.adjacent].sort().join(', ')}`);

  return {
    output: output.join('\n\n'),
    state: { room: id, found: item ? [...state.found, item] : state.found },
  };
}
