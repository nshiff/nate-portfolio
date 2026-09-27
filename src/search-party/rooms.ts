import { ITEMS } from './items';
import type { ItemId } from './items';
import type { GameState } from './game';
import type { ZoneId } from './zones';

export type Room = {
  description: string;
  // Sets the terminal's colours while the player is here.
  zone: ZoneId;
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
    zone: 'SHIP',
    adjacent: ['CORRIDOR'],
    item: 'SECRETRECIPE',
  },
  CORRIDOR: {
    description: 'A narrow CORRIDOR. The lights hum softly overhead.',
    zone: 'SHIP',
    adjacent: ['BEDROOM', 'BRIDGE', 'GALLEY', 'ENGINEERING', 'TURBOLIFT'],
  },
  BRIDGE: {
    description: 'The BRIDGE. Stars drift slowly past the viewscreen.',
    zone: 'SHIP',
    adjacent: ['CORRIDOR', 'COMMSROOM', 'OBSERVATORY'],
    item: 'STARCHART',
  },
  COMMSROOM: {
    description: 'The COMMSROOM. Static crackles on every channel.',
    zone: 'SHIP',
    adjacent: ['BRIDGE'],
  },
  OBSERVATORY: {
    description: 'The OBSERVATORY. A telescope points at a distant nebula.',
    zone: 'SHIP',
    adjacent: ['BRIDGE', 'CONSERVATORY'],
  },
  GALLEY: {
    description: 'A compact GALLEY. Something smells delicious.',
    zone: 'SHIP',
    adjacent: ['CORRIDOR', 'HYDROPONICS', 'DININGROOM', 'STUDY'],
  },
  HYDROPONICS: {
    description: 'The HYDROPONICS bay. Tomatoes glow under violet lamps.',
    zone: 'SHIP',
    adjacent: ['GALLEY', 'CONSERVATORY'],
  },
  CONSERVATORY: {
    description: 'A glass CONSERVATORY. Alien ferns curl toward the stars.',
    zone: 'SHIP',
    adjacent: ['HYDROPONICS', 'OBSERVATORY', 'LOUNGE'],
  },
  DININGROOM: {
    description: 'A long DININGROOM. Six places are set for dinner.',
    zone: 'SHIP',
    adjacent: ['GALLEY', 'BALLROOM', 'LOUNGE'],
  },
  LOUNGE: {
    description: 'A plush LOUNGE. A hidden passage leads to the CONSERVATORY.',
    zone: 'SHIP',
    adjacent: ['DININGROOM', 'CONSERVATORY'],
  },
  BALLROOM: {
    description: 'A zero-gravity BALLROOM. The chandelier floats gently.',
    zone: 'SHIP',
    adjacent: ['DININGROOM', 'BILLIARDROOM', 'TURBOLIFT'],
  },
  BILLIARDROOM: {
    description: 'The BILLIARDROOM. The balls hover above the table.',
    zone: 'SHIP',
    adjacent: ['BALLROOM', 'LIBRARY'],
  },
  LIBRARY: {
    description: 'A quiet LIBRARY. Paper books, of all things.',
    zone: 'SHIP',
    adjacent: ['BILLIARDROOM', 'STUDY'],
    item: 'CANDLESTICK',
  },
  STUDY: {
    description: 'A cramped STUDY. A hidden passage leads to the GALLEY.',
    zone: 'SHIP',
    adjacent: ['LIBRARY', 'GALLEY'],
  },
  TURBOLIFT: {
    description: 'The TURBOLIFT. It asks politely which deck.',
    zone: 'SHIP',
    adjacent: ['CORRIDOR', 'BALLROOM', 'MEDBAY', 'GYMNASIUM', 'CARGOHOLD'],
  },
  MEDBAY: {
    description: 'The MEDBAY. A robot doctor waits patiently.',
    zone: 'SHIP',
    adjacent: ['TURBOLIFT'],
  },
  GYMNASIUM: {
    description: 'A small GYMNASIUM. The treadmill faces a window of stars.',
    zone: 'SHIP',
    adjacent: ['TURBOLIFT', 'LAUNDRY'],
  },
  LAUNDRY: {
    description: 'The LAUNDRY. One sock is missing, as always.',
    zone: 'SHIP',
    adjacent: ['GYMNASIUM'],
  },
  CARGOHOLD: {
    description: 'The CARGOHOLD. Crates are stacked to the ceiling.',
    zone: 'SHIP',
    adjacent: ['TURBOLIFT', 'BRIG', 'HANGAR'],
  },
  BRIG: {
    description: 'An empty BRIG. The cell door hangs open.',
    zone: 'SHIP',
    adjacent: ['CARGOHOLD'],
  },
  ENGINEERING: {
    description: 'ENGINEERING. The reactor thrums steadily.',
    zone: 'SHIP',
    adjacent: ['CORRIDOR', 'AIRLOCK'],
    item: 'PLASMAWRENCH',
  },
  AIRLOCK: {
    description: 'The AIRLOCK. The outer door stays firmly shut.',
    zone: 'SHIP',
    adjacent: ['ENGINEERING', 'HANGAR'],
  },
  HANGAR: {
    description: 'A busy HANGAR. A SHUTTLE waits, engines warm.',
    zone: 'SHIP',
    adjacent: ['AIRLOCK', 'CARGOHOLD', 'SHUTTLE'],
  },
  SHUTTLE: {
    description: 'A small SHUTTLE. Destinations blink on the console.',
    zone: 'SHUTTLE',
    adjacent: ['HANGAR', 'MOONPORT', 'MARSPORT', 'EUROPAPORT', 'TITANPORT', 'DOCKINGRING'],
  },

  // --- The Moon ---
  MOONPORT: {
    description: 'The MOONPORT. Earth hangs low on the horizon.',
    zone: 'MOON',
    adjacent: ['SHUTTLE', 'MOONBASE', 'TRANQUILITY'],
  },
  MOONBASE: {
    description: 'The MOONBASE. Everything here is a little dusty.',
    zone: 'MOON',
    adjacent: ['MOONPORT', 'HELIUMMINE', 'MOONHOTEL'],
  },
  HELIUMMINE: {
    description: 'A HELIUMMINE. Drills whir in the dark.',
    zone: 'MOON',
    adjacent: ['MOONBASE'],
  },
  MOONHOTEL: {
    description: 'The MOONHOTEL. Every room has an Earth view.',
    zone: 'MOON',
    adjacent: ['MOONBASE'],
  },
  TRANQUILITY: {
    description: 'The Sea of TRANQUILITY. Old footprints lead away.',
    zone: 'MOON',
    adjacent: ['MOONPORT', 'CRATER', 'GOLFCOURSE'],
  },
  GOLFCOURSE: {
    description: 'A lunar GOLFCOURSE. Two old golf balls lie nearby.',
    zone: 'MOON',
    adjacent: ['TRANQUILITY'],
  },
  CRATER: {
    description: 'A deep CRATER. The rim is sharp against the stars.',
    zone: 'MOON',
    adjacent: ['TRANQUILITY', 'FARSIDE'],
  },
  FARSIDE: {
    description: 'The FARSIDE of the moon. It is very quiet here.',
    zone: 'MOON',
    adjacent: ['CRATER'],
    item: 'MOONSTONE',
  },

  // --- Mars ---
  MARSPORT: {
    description: 'The MARSPORT. The sky is a dusty pink.',
    zone: 'MARS',
    adjacent: ['SHUTTLE', 'COLONYDOME', 'REDDESERT'],
    item: 'PASSPORT',
  },
  COLONYDOME: {
    description: 'A bustling COLONYDOME. Everyone here was born somewhere else.',
    zone: 'MARS',
    adjacent: ['MARSPORT', 'POTATOFARM', 'ROVERGARAGE'],
  },
  POTATOFARM: {
    description: 'A POTATOFARM. Someone grew these the hard way.',
    zone: 'MARS',
    adjacent: ['COLONYDOME'],
  },
  ROVERGARAGE: {
    description: 'The ROVERGARAGE. A little rover blinks hello.',
    zone: 'MARS',
    adjacent: ['COLONYDOME'],
  },
  REDDESERT: {
    description: 'A vast REDDESERT. Rusty dunes stretch on forever.',
    zone: 'MARS',
    adjacent: ['MARSPORT', 'MARINERIS', 'OLYMPUSMONS'],
  },
  OLYMPUSMONS: {
    description: 'OLYMPUSMONS. The tallest mountain you have ever seen.',
    zone: 'MARS',
    adjacent: ['REDDESERT'],
  },
  MARINERIS: {
    description: 'The MARINERIS canyon. It could swallow a continent.',
    zone: 'MARS',
    adjacent: ['REDDESERT', 'POLARCAP'],
  },
  POLARCAP: {
    description: 'The POLARCAP. Dry ice crunches underfoot.',
    zone: 'MARS',
    adjacent: ['MARINERIS'],
  },

  // --- Europa ---
  EUROPAPORT: {
    description: 'The EUROPAPORT. Jupiter fills half the sky.',
    zone: 'EUROPA',
    adjacent: ['SHUTTLE', 'ICESHELF', 'RESEARCHLAB'],
  },
  RESEARCHLAB: {
    description: 'A RESEARCHLAB. Every sample is labelled carefully.',
    zone: 'EUROPA',
    adjacent: ['EUROPAPORT', 'AQUARIUM'],
  },
  AQUARIUM: {
    description: 'An AQUARIUM. Something small and glowing swims by.',
    zone: 'EUROPA',
    adjacent: ['RESEARCHLAB'],
  },
  ICESHELF: {
    description: 'The ICESHELF. It groans and creaks beneath you.',
    zone: 'EUROPA',
    adjacent: ['EUROPAPORT', 'ICECAVE', 'DRILLSITE'],
  },
  ICECAVE: {
    description: 'A blue ICECAVE. Your breath hangs in the air.',
    zone: 'EUROPA',
    adjacent: ['ICESHELF'],
  },
  DRILLSITE: {
    description: 'The DRILLSITE. The bore hole reaches the ocean below.',
    zone: 'EUROPA',
    adjacent: ['ICESHELF', 'SUBMARINE'],
    item: 'SPACEHELMET',
  },
  SUBMARINE: {
    description: 'A tiny SUBMARINE. Portholes look out on dark water.',
    zone: 'EUROPA',
    adjacent: ['DRILLSITE', 'OCEANFLOOR'],
  },
  OCEANFLOOR: {
    description: 'The OCEANFLOOR. Warm vents bubble in the dark.',
    zone: 'EUROPA',
    adjacent: ['SUBMARINE'],
  },

  // --- Titan ---
  TITANPORT: {
    description: 'The TITANPORT. An orange haze hides the sun.',
    zone: 'TITAN',
    adjacent: ['SHUTTLE', 'DUNES', 'METHANELAKE'],
  },
  DUNES: {
    description: 'Dark DUNES. The grains are frozen hydrocarbons.',
    zone: 'TITAN',
    adjacent: ['TITANPORT', 'WEATHERSTATION', 'LANDERSITE'],
  },
  WEATHERSTATION: {
    description: 'A WEATHERSTATION. The forecast is methane rain.',
    zone: 'TITAN',
    adjacent: ['DUNES'],
  },
  LANDERSITE: {
    description: 'An old LANDERSITE. A small probe rests where it fell.',
    zone: 'TITAN',
    adjacent: ['DUNES'],
  },
  METHANELAKE: {
    description: 'A calm METHANELAKE. It is far too cold to swim.',
    zone: 'TITAN',
    adjacent: ['TITANPORT', 'BOATHOUSE', 'SHORELINE'],
  },
  BOATHOUSE: {
    description: 'A BOATHOUSE. The little boat is built for methane seas.',
    zone: 'TITAN',
    adjacent: ['METHANELAKE'],
    item: 'TOWEL',
  },
  SHORELINE: {
    description: 'A misty SHORELINE. Pebbles of ice line the shore.',
    zone: 'TITAN',
    adjacent: ['METHANELAKE', 'CRYOVOLCANO'],
  },
  CRYOVOLCANO: {
    description: 'A CRYOVOLCANO. It erupts with slush instead of lava.',
    zone: 'TITAN',
    adjacent: ['SHORELINE'],
  },

  // --- The ring station ---
  DOCKINGRING: {
    description: 'The DOCKINGRING. Ships from every world come and go.',
    zone: 'STATION',
    adjacent: ['SHUTTLE', 'PROMENADE'],
  },
  PROMENADE: {
    description: 'The PROMENADE. Travelers chatter in a dozen languages.',
    zone: 'STATION',
    adjacent: ['DOCKINGRING', 'BAZAAR', 'CANTINA', 'MUSEUM', 'ARCADE'],
  },
  BAZAAR: {
    description: 'A crowded BAZAAR. Merchants sell spices from six moons.',
    zone: 'STATION',
    adjacent: ['PROMENADE', 'EMBASSY'],
  },
  EMBASSY: {
    description: 'An EMBASSY. A notice warns of a thief in a red coat.',
    zone: 'STATION',
    adjacent: ['BAZAAR'],
  },
  CANTINA: {
    description: 'A dim CANTINA. The band only knows one song.',
    zone: 'STATION',
    adjacent: ['PROMENADE', 'CASINO'],
  },
  CASINO: {
    description: 'A glittering CASINO. The house always wins.',
    zone: 'STATION',
    adjacent: ['CANTINA'],
  },
  MUSEUM: {
    description: 'The MUSEUM. One display case sits empty.',
    zone: 'STATION',
    adjacent: ['PROMENADE'],
    item: 'FEDORA',
  },
  ARCADE: {
    description: 'A noisy ARCADE. Someone holds the high score on every machine.',
    zone: 'STATION',
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
