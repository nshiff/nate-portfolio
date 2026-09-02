/* ============================================================
   Search Party
   A small text world: six rooms, a short spine with a fork at
   the end. Walk it slowly. Look at things. Scan the ones that
   seem off. No case, no clock — just the town at night and a
   scanner that keeps finding stuff it can't explain.
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
    default: "#33ff66",
  };

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  /* ----------------------------------------------------------
     World. Six rooms. The key IS the display name — uppercase,
     single-token. `description` shows on entry (short, mobile-
     first, spells the room name in caps as flavour). `anomaly`
     is the opt-in scanner readout — detail lives here, since
     you only see it on demand. Deadpan / Calvin-and-Hobbes
     register: cosmic thing, domestic framing.
     ---------------------------------------------------------- */

  const ROOMS = {
    BEDROOM: {
      description: "Your BEDROOM. The bed is made, which is suspicious. A cold mug of tea on the sill has a skin on it.",
      adjacent: ["LIVINGROOM"],
      allowSleep: true,
      anomaly: "Scanner boots with a chirp. HOME. AMBIENT WEIRDNESS: 2%, all of it the sock pile. The tea, it notes, is exactly room temperature and has been for hours.",
    },
    LIVINGROOM: {
      description: "A gorgeous rug with geometric patterns adorns the LIVINGROOM. The patterns are, on reflection, a star chart.",
      adjacent: ["BEDROOM", "FRONTLAWN"],
      allowSleep: true,
      anomaly: "The rug resolves to a navigation plot. There's a destination marker on it, sitting well off the edge of anything municipal. Someone has vacuumed over the important part.",
    },
    FRONTLAWN: {
      description: "The grass on the FRONTLAWN could use a trim. One rectangular patch is pressed flat, as if something large parked here briefly and politely.",
      adjacent: ["LIVINGROOM", "DOWNTOWN", "CITYPARK", "FOREST"],
      anomaly: "Flattened patch: four contact points, a lot of kilograms, departed straight up. The grass under it is warm and smells of ozone and, oddly, funnel cake.",
    },
    DOWNTOWN: {
      description: "The hustle and bustle of DOWNTOWN. Every third pedestrian is holding a purple octopus plush and pretending they always have.",
      adjacent: ["FRONTLAWN"],
      anomaly: "Plush density: abnormal. Each octopus pings the same channel on a slow, patient interval. They are, technically, a network. Nobody will make eye contact about it.",
    },
    CITYPARK: {
      description: "The CITYPARK has a playground, sporting facilities, and a commemorative plaque for something that isn't there anymore.",
      adjacent: ["FRONTLAWN"],
      anomaly: "The plaque's mounting bolts are sheared clean and there are fresh drag marks leading away toward the fountain. Scanner estimates the missing mass in the tens of tonnes and then, politely, stops.",
    },
    FOREST: {
      description: "Some peace and quiet in the FOREST. Then you notice the birdsong loops every eleven seconds.",
      adjacent: ["FRONTLAWN"],
      allowSleep: true,
      anomaly: "The birdsong is a four-bar sample on repeat. Under it, a low carrier tone. Something out here is politely holding a channel open and waiting for someone to pick up.",
    },
  };

  const START_ROOM = "BEDROOM";
  let currentRoom = START_ROOM;
  const visited = new Set([START_ROOM]);

  const SLEEP_FEELINGS = [
    "refreshed",
    "great, actually",
    "terrible",
    "groggy and vaguely accused of something",
    "like you dreamed in a language you don't speak",
    "like the octopus plush was in it",
    "ready to solve a mystery, or at least start one",
  ];

  function describeRoom(id) {
    const room = ROOMS[id];
    return `${room.description}\n\nExits: ${[...room.adjacent].sort().join(", ")}`;
  }

  const COMMANDS = {
    whoami: {
      run: () => "player",
    },
    map: {
      run: () => Object.keys(ROOMS)
        .filter((id) => visited.has(id))
        .sort()
        .map((id) => `${id}${id === currentRoom ? " (you are here)" : ""}`)
        .join("\n"),
    },
    sleep: {
      run: () => {
        if (!ROOMS[currentRoom].allowSleep) return "You can't sleep here.";
        return `You awake feeling ${pick(SLEEP_FEELINGS)}.`;
      },
    },
    walk: {
      run: (arg) => {
        const target = (arg || "").trim().toUpperCase();
        if (!target) return "Walk where? (walk ROOMNAME)";
        const destination = ROOMS[currentRoom].adjacent.find((id) => id === target);
        if (!destination) return `Can't walk to "${arg.trim()}" from here.`;
        currentRoom = destination;
        visited.add(destination);
        return describeRoom(destination);
      },
    },
    look: {
      run: () => describeRoom(currentRoom),
    },
    scan: {
      run: () => ROOMS[currentRoom].anomaly || "Scanner finds nothing unusual. It sounds disappointed.",
    },
    color: {
      run: (arg) => {
        const name = (arg || "").trim().toLowerCase();
        if (!name) return "Color what? Try \"color green\", \"color amber\", \"color white\", or \"color default\".";
        if (!COLORS[name]) return `Unknown color: "${name}". Try green, amber, white, or default.`;
        setColor(name);
        return `Color set to ${name}.`;
      },
    },
    help: {
      run: () => Object.keys(COMMANDS)
        .sort((a, b) => a < b ? -1 : 1)
        .join("\t"),
    },
    exit: {
      run: () => {
        input.disabled = true;
        return "Simulation ended.";
      },
    },
  };

  function setColor(name) {
    if (!COLORS[name]) return;
    root.style.setProperty("--fg", COLORS[name]);
    try {
      localStorage.setItem("searchparty-color", name);
    } catch {
      // storage unavailable — ignore, defaults to green next load
    }
  }

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
    print("\n");
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

  print('Type "help" to see available commands.\n\n');
  print(describeRoom(START_ROOM));
  input.focus();
})();
