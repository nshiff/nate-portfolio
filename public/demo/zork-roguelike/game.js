/* ============================================================
   Search Party
   REPL shell: input handling, built-in commands, color theme.
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

  // The story begins in a bedroom. More rooms will join this map later.
  // Room keys double as display names (e.g. LIVING_ROOM is shown as-is).
  const ROOMS = {
    BEDROOM: {
      description: "You look around a small BEDROOM. Pretty tidy, all things considered.",
      adjacent: ["LIVING_ROOM"],
    },
    LIVING_ROOM: {
      description: "It doesn't look like anyone uses the couch much in this LIVING_ROOM.",
      adjacent: ["BEDROOM"],
    },
  };

  const START_ROOM = "BEDROOM";
  let currentRoom = START_ROOM;
  const visited = new Set([START_ROOM]);

  const SLEEP_FEELINGS = ["refreshed", "alright", "terrible", "groggy", "oddly energized", "like you dreamed in a language you don't speak"];

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function describeRoom(id) {
    const room = ROOMS[id];
    return `${room.description}\nadjacent: ${room.adjacent.join(", ")}`;
  }

  const COMMANDS = {
    whoami: {
      help: "whoami",
      run: () => "player",
    },
    map: {
      help: "map",
      run: () => Object.keys(ROOMS)
        .filter((id) => visited.has(id))
        .map((id) => `${id}${id === currentRoom ? " (you are here)" : ""}`)
        .join("\n"),
    },
    sleep: {
      help: "sleep",
      run: () => `You awake feeling ${pick(SLEEP_FEELINGS)}.`,
    },
    walk: {
      help: "walk",
      run: (arg) => {
        const target = (arg || "").trim().toUpperCase().replace(/\s+/g, "_");
        if (!target) return "Walk where? Try \"walk <room name>\".";
        const destination = ROOMS[currentRoom].adjacent.find((id) => id === target);
        if (!destination) return `You can't walk to "${arg.trim()}" from here.`;
        currentRoom = destination;
        visited.add(destination);
        return describeRoom(destination);
      },
    },
    color: {
      help: "color",
      run: (arg) => {
        const name = (arg || "").trim().toLowerCase();
        if (!name) return "Color what? Try \"color green\", \"color amber\", \"color white\", or \"color default\".";
        if (!COLORS[name]) return `Unknown color: "${name}". Try green, amber, white, or default.`;
        setColor(name);
        return `Color set to ${name}.`;
      },
    },
    help: {
      help: "help",
      run: () => Object
        .values(COMMANDS)
        .map((c) => c.help)
        .sort((a, b) => a < b ? -1 : 1)
        .join("\t"),
    },
    exit: {
      help: "exit",
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
