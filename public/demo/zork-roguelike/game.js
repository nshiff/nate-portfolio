/* ============================================================
   Search Party — a Zork-like text adventure
   REPL shell: input handling, built-in commands, color theme.
   ============================================================ */

(() => {
  "use strict";

  const output = document.getElementById("output");
  const input = document.getElementById("cmd");
  const root = document.documentElement;
  const swatches = document.querySelectorAll(".swatch");

  const COLORS = {
    green: "#33ff66",
    amber: "#ffb02e",
    white: "#e8e8e8",
  };

  // The case: one WHO/WHAT/WHERE combo, rolled once per session, Clue-style.
  const WHO = [
    "the ship's cat, who has definitely been to space before this trip",
    "a vending machine that only dispenses to people it likes",
    "your bunkmate's sock puppet, unattended, doing most of the talking now",
    "a cadet who insists they've always been the captain",
    "something wearing the janitor's uniform, badly",
    "your own shadow, running about four seconds ahead of you",
  ];

  const WHAT = [
    "a can of soup that's colder than the freezer it came from",
    "a single glove floating in the corridor at exactly eye level",
    "a musical number stuck playing on a loop nobody can locate",
    "a to-do list, not in anyone's handwriting, with your name already checked off",
    "a smell like static electricity and grape soda",
    "a door handle that's warm and faintly purring",
  ];

  // WHERE doubles as the room graph: each entry is a place the player can
  // walk to via "go <direction>". theCase.where is the "answer" (shown by
  // status) but is NOT where the player starts — you have to find it.
  const ROOMS = {
    broomCloset: {
      name: "the broom closet that has, generously, three moons",
      look: "A mop leans in the corner like it's trying not to be noticed. Through a gap in the shelving, three small moons hang in a sky that has no business being back here.",
      exits: { south: "hallway" },
    },
    cafeteria: {
      name: "the cafeteria, but it's Tuesday there and Thursday everywhere else",
      look: "Trays are stacked for a Tuesday lunch rush. The calendar on the wall insists it's Thursday. Both are right, somehow, and neither of them wants to talk about it.",
      exits: { west: "hallway", north: "vendingNook" },
    },
    vendingNook: {
      name: "behind the vending machines, where the vents whisper",
      look: "The vending machines hum in a key that doesn't exist. Behind them, a gap just wide enough to squeeze through leads to a vent that whispers, very politely, in a language you don't speak yet.",
      exits: { south: "cafeteria", east: "escapePod" },
    },
    escapePod: {
      name: "the escape pod nobody remembers launching",
      look: "The pod's hatch is open. The seat is still warm. The log shows a launch that, as far as anyone can tell, never happened — and yet here you are, standing in the proof that it did.",
      exits: { west: "vendingNook", south: "captainsOffice" },
    },
    captainsOffice: {
      name: "the captain's office, rearranged into a pillow fort",
      look: "Regulation cushions have been repurposed into ramparts. A hand-drawn flag flies from a broomstick. Someone in here takes fort-building very, very seriously.",
      exits: { north: "escapePod", west: "hallway" },
    },
    deckGap: {
      name: "the space between two decks that the blueprints insist doesn't exist",
      look: "The blueprints, framed and official-looking, show solid wall exactly where you're standing. The wall disagrees. It's colder here, and quieter, like the ship is holding its breath.",
      exits: { east: "hallway" },
    },
    hallway: {
      name: "the main hallway",
      look: "A long, ordinary hallway, humming with ordinary lights. Doors lead off in every direction — none of them look like they lead somewhere ordinary.",
      exits: {
        north: "broomCloset",
        east: "cafeteria",
        south: "captainsOffice",
        west: "deckGap",
      },
    },
  };

  const START_ROOM = "hallway";
  let currentRoom = START_ROOM;

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  const theCase = {
    who: pick(WHO),
    what: pick(WHAT),
    where: pick(Object.keys(ROOMS).filter((id) => id !== START_ROOM)),
  };

  function describeRoom(id) {
    const room = ROOMS[id];
    const exits = Object.keys(room.exits).join(", ");
    return `${room.look}\n\nExits: ${exits}`;
  }

  const COMMANDS = {
    whoami: {
      help: "whoami — print the current player name",
      run: () => "player",
    },
    look: {
      help: "look — describe your surroundings",
      run: () => describeRoom(currentRoom),
    },
    go: {
      help: "go <direction> — move through an exit (e.g. \"go north\")",
      run: (arg) => {
        const direction = (arg || "").trim().toLowerCase();
        if (!direction) return "Go where? Try \"go north\" or check \"look\" for exits.";
        const destination = ROOMS[currentRoom].exits[direction];
        if (!destination) return `You can't go ${direction} from here.`;
        currentRoom = destination;
        return describeRoom(currentRoom);
      },
    },
    status: {
      help: "status — review what you know about the case",
      run: () => `WHO: ${theCase.who}\nWHAT: ${theCase.what}\nWHERE: ${ROOMS[theCase.where].name}`,
    },
    help: {
      help: "help — list available commands",
      run: () => Object.values(COMMANDS).map((c) => c.help).join("\n")
        + "\n\nTip: click a color swatch in the top-right corner to change the terminal's text color (green/amber/white).",
    },
    exit: {
      help: "exit — end the simulation",
      run: () => {
        input.disabled = true;
        return "Simulation ended.";
      },
    },
  };

  function setColor(name) {
    if (!COLORS[name]) return;
    root.style.setProperty("--fg", COLORS[name]);
    swatches.forEach((s) => s.classList.toggle("active", s.dataset.color === name));
    try {
      localStorage.setItem("searchparty-color", name);
    } catch {
      // storage unavailable — ignore, defaults to green next load
    }
  }

  swatches.forEach((s) => {
    s.addEventListener("click", () => setColor(s.dataset.color));
  });

  let savedColor = "green";
  try {
    savedColor = localStorage.getItem("searchparty-color") || "green";
  } catch {
    // storage unavailable — fall back to default
  }
  setColor(COLORS[savedColor] ? savedColor : "green");

  function print(text) {
    const line = document.createElement("div");
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function printEcho(text) {
    const line = document.createElement("div");
    line.textContent = "> " + text;
    line.style.opacity = "0.7";
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function handle(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    printEcho(trimmed);

    const [name, ...rest] = trimmed.toLowerCase().split(/\s+/);
    const command = COMMANDS[name];
    if (!command) {
      print(`Unknown command: "${trimmed}". Type "help" for a list of commands.`);
      return;
    }
    print(command.run(rest.join(" ")));
  }

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const value = input.value;
    input.value = "";
    handle(value);
  });

  print("Search Party — a Zork-like text adventure.");
  print('Type "help" to see available commands.');
  input.focus();
})();
