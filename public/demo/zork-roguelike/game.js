/* ============================================================
   Search Party
   A small Zork-like text world.
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

  function sample(list, count) {
    const pool = [...list];
    const out = [];
    while (out.length < count && pool.length) {
      out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }
    return out;
  }

  const ROOMS = {
    BEDROOM: {
      description:
        "A small BEDROOM.\n\nSeveral rare playing cards sit unsleeved on the desk.",
      adjacent: ["LIVINGROOM"],
    },
    LIVINGROOM: {
      description:
        "A cozy LIVINGROOM.\n\nA beautiful geometric rug adorns the LIVINGROOM.",
      adjacent: ["BEDROOM", "FRONTLAWN"],
    },
    FRONTLAWN: {
      description:
        "The grass on the FRONTLAWN could use a trim.",
      adjacent: ["LIVINGROOM", "DOWNTOWN", "CITYPARK", "FOREST"],
    },
    DOWNTOWN: {
      description:
        "Feel the hustle and bustle of DOWNTOWN.\n\nAnyone who's anyone is downtown!",
      adjacent: ["FRONTLAWN"],
    },
    CITYPARK: {
      description: "A CITYPARK with a nice fountain.\n\nThe water is so clear!",
      adjacent: ["FRONTLAWN"],
    },
    FOREST: {
      description: "A tranquil FOREST.\n\nThat is one big tree.",
      adjacent: ["FRONTLAWN"],
    },
  };

  const START_ROOM = "BEDROOM";
  let currentRoom = START_ROOM;
  const visited = new Set([START_ROOM]);

  const SEEKITEMS = {
    PLAYINGCARDS: {
      description: "a well-loved deck of PLAYINGCARDS.",
    },
    FANCYSUIT: {
      description: "a FANCYSUIT, and it's your size!",
    },
    SILVERCOIN: {
      description: "a shiny SILVERCOIN.",
    },
    WRISTWATCH: {
      description: "a snazzy WRISTWATCH.",
    },
    SUNGLASSES: {
      description: "a pair of reflective SUNGLASSES.",
    },
    SECRETRECIPE: {
      description: "a worn index card containing a SECRETRECIPE.",
    },
  };

  const SEEK_PLACEMENTS = {};
  const seekRooms = sample(Object.keys(ROOMS), 3);
  const seekItems = sample(Object.keys(SEEKITEMS), 3);
  seekRooms.forEach((roomId, i) => {
    SEEK_PLACEMENTS[roomId] = seekItems[i];
  });

  const foundItems = [];

  function describeRoom(id) {
    const room = ROOMS[id];
    return `Location:\n${room.description}\n\nAdjacent:\n${[...room.adjacent].sort().join(", ")}`;
  }

  const COMMANDS = {
    LOOK: {
      run: () => describeRoom(currentRoom),
    },
    MAP: {
      run: () =>
        Object.keys(ROOMS)
          .filter((id) => visited.has(id))
          .sort()
          .map((id) => `${id}${id === currentRoom ? " (you are here)" : ""}`)
          .join("\n"),
    },
    WALK: {
      run: (arg) => {
        const target = (arg || "").trim().toUpperCase();
        if (!target) {
          return "Try: WALK ROOMNAME";
        }
        const destination = ROOMS[currentRoom].adjacent.find(
          (id) => id === target,
        );
        if (!destination) {
          return `Cannot walk to ${target} from here.`;
        }
        currentRoom = destination;
        visited.add(destination);
        return describeRoom(destination);
      },
    },
    COLOR: {
      run: (arg) => {
        const name = (arg || "").trim().toLowerCase();
        if (!name) {
          return "Try: COLOR COLORNAME\nAvailable colors: GREEN, AMBER, WHITE";
        }
        if (!COLORS[name]) {
          return `Unknown color: ${name}. Try green, amber, or white.`;
        }
        setColor(name);
        return `Color set to ${name}.`;
      },
    },
    HELP: {
      run: () =>
        Object.keys(COMMANDS)
          .sort()
          .join("\t"),
    },
    SEEK: {
      run: () => {
        const item = SEEK_PLACEMENTS[currentRoom];
        if (!item) {
          return "Your search turned up nothing.";
        }
        if (foundItems.includes(item)) {
          return "Nothing else to find here.";
        }
        foundItems.push(item);
        return `You found ${SEEKITEMS[item].description}`;
      },
    },
    ABOUT: {
      run: () => "Search Party\nA Zork-like sandbox game. Developed for the web by Nate Shiff with Claude Code.",
    },
    ITEMS: {
      run: () => {
        if (!foundItems.length) {
          return "No items found.";
        }
        return [...foundItems].sort().join("\n");
      },
    },
  };

  function setColor(name) {
    if (!COLORS[name]) {
      return;
    }
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
    if (!trimmed) {
      return;
    }
    print("\n");
    printEcho(trimmed);

    const [name, ...rest] = trimmed.split(/\s+/);
    const command = COMMANDS[name.toUpperCase()];
    if (!command) {
      print(
        `Unknown command: ${trimmed.toUpperCase()}.\nRun HELP to list available commands.`,
      );
      return;
    }
    print(command.run(rest.join(" ")));
  }

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    const value = input.value;
    input.value = "";
    handle(value);
  });

  print("Run help or HELP to list available commands.\n\n");
  print(describeRoom(START_ROOM));
  input.focus();
})();
