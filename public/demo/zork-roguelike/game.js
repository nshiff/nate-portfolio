/* ============================================================
   Search Party
   A small text world: six rooms, a short spine with a fork at
   the end. Walk it slowly. No case, no clock — just the town.
   ============================================================ */

(() => {
  "use strict";

  const output = document.getElementById("output");
  const input = document.getElementById("cmd");
  const root = document.documentElement;

  const COLORS = {
    green: "#33ff66",
    amber: "#ffb02e",
    white: "#e8e8e8",
  };

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  /* ----------------------------------------------------------
     World. Six rooms. The key IS the display name — uppercase,
     single-token. `description` shows on entry (kept short,
     mobile-first, spells the room name in caps as flavour).
     ---------------------------------------------------------- */

  const ROOMS = {
    BEDROOM: {
      description: "A small BEDROOM.\n\nSeveral rare playing cards sit unsleeved on the desk.",
      adjacent: ["LIVINGROOM"],
      allowSleep: true,
    },
    LIVINGROOM: {
      description: "A cozy LIVINGROOM.\n\nA beautiful geometric rug adorns the LIVINGROOM.",
      adjacent: ["BEDROOM", "FRONTLAWN"],
      allowSleep: true,
    },
    FRONTLAWN: {
      description: "The FRONTLAWN gives you a good look at the neighborhood.\n\nThe grass could use a trim.",
      adjacent: ["LIVINGROOM", "DOWNTOWN", "CITYPARK", "FOREST"],
    },
    DOWNTOWN: {
      description: "Feel the hustle and bustle of DOWNTOWN.\n\nAnyone who's anyone is downtown!",
      adjacent: ["FRONTLAWN"],
    },
    CITYPARK: {
      description: "A CITYPARK with a nice fountain.\n\nThe water is so clear!",
      adjacent: ["FRONTLAWN"],
    },
    FOREST: {
      description: "A tranquil FOREST.\n\nThat is one big tree.",
      adjacent: ["FRONTLAWN"],
      allowSleep: true,
    },
  };

  const START_ROOM = "BEDROOM";
  let currentRoom = START_ROOM;
  const visited = new Set([START_ROOM]);

  /* ----------------------------------------------------------
     Findable items. Same shape as ROOMS — the key IS the
     display name (uppercase, single-token), `description` is
     one short line. One of these gets hidden in a random room.
     ---------------------------------------------------------- */

  const SEEKITEMS = {
    GOLDBARS: {
      description: "A tidy stack of gold bars. Heavier than they look.",
    },
    FANCYSUIT: {
      description: "A three-piece suit in your exact size. Suspicious.",
    },
    BURRITO: {
      description: "A warm burrito wrapped in foil. Someone's loss.",
    },
    RUBBERDUCK: {
      description: "A small rubber duck. It has seen things.",
    },
    SUNGLASSES: {
      description: "Sunglasses that make everything look cooler.",
    },
    SECRETRECIPE: {
      description: "A folded index card marked \"DO NOT LOSE.\"",
    },
  };

  const SLEEP_FEELINGS = [
    "refreshed",
    "great, actually",
    "terrible",
    "groggy",
    "suspiciously good",
  ];

  function describeRoom(id) {
    const room = ROOMS[id];
    return `Location:\n${room.description}\n\nAdjacent:\n${[...room.adjacent].sort().join(", ")}`;
  }

  const COMMANDS = {
    LOOK: {
      run: () => describeRoom(currentRoom),
    },
    MAP: {
      run: () => Object.keys(ROOMS)
        .filter((id) => visited.has(id))
        .sort()
        .map((id) => `${id}${id === currentRoom ? " (you are here)" : ""}`)
        .join("\n"),
    },
    SLEEP: {
      run: () => {
        if (!ROOMS[currentRoom].allowSleep) return "You can't sleep here.";
        return `You awake feeling ${pick(SLEEP_FEELINGS)}.`;
      },
    },
    WALK: {
      run: (arg) => {
        const target = (arg || "").trim().toUpperCase();
        if (!target) return "Try: WALK ROOMNAME";
        const destination = ROOMS[currentRoom].adjacent.find((id) => id === target);
        if (!destination) return `Cannot reach ${target} from here.`;
        currentRoom = destination;
        visited.add(destination);
        return describeRoom(destination);
      },
    },
    COLOR: {
      run: (arg) => {
        const name = (arg || "").trim().toLowerCase();
        if (!name) return "Try: COLOR COLORNAME\nAvailable colors: GREEN, AMBER, WHITE";
        if (!COLORS[name]) return `Unknown color: ${name}. Try green, amber, or white.`;
        setColor(name);
        return `Color set to ${name}.`;
      },
    },
    HELP: {
      run: () => Object.keys(COMMANDS)
        .sort((a, b) => a < b ? -1 : 1)
        .join("\t"),
    },
    SEEK: {
      run: () => "Your search turned up nothing.",
    },
  };

  function setColor(name) {
    if (!COLORS[name]) return;
    root.style.setProperty("--fg", COLORS[name]);
  }

  function print(text) {
    const line = document.createElement("div");
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function printEcho(text) {
    const line = document.createElement("div");
    line.textContent = "> " + text.toUpperCase();
    line.style.opacity = "0.7";
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function handle(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    print("\n");
    printEcho(trimmed);

    const [name, ...rest] = trimmed.split(/\s+/);
    const command = COMMANDS[name.toUpperCase()];
    if (!command) {
      print(`Unknown command: ${trimmed.toUpperCase()}.\nRun HELP to list available commands.`);
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

  print('Run help or HELP to list available commands.\n\n');
  print(describeRoom(START_ROOM));
  input.focus();
})();
