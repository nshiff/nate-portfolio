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

  const ROOMS = {
    BEDROOM: {
      description: "You stand in a small BEDROOM.",
      adjacent: ["LIVINGROOM"],
      allowSleep: true,
    },
    LIVINGROOM: {
      description: "A gorgeous rug with geometric patterns adorns the LIVINGROOM.",
      adjacent: ["BEDROOM", "FRONTLAWN"],
      allowSleep: true,
    },
    FRONTLAWN: {
      description: "The grass on the FRONTLAWN could use a trim.",
      adjacent: ["LIVINGROOM"],
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
      run: () => "player",
    },
    map: {
      run: () => Object.keys(ROOMS)
        .filter((id) => visited.has(id))
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
        if (!target) return "Walk where? Try \"walk ROOMNAME\" to an adjacent room.";
        const destination = ROOMS[currentRoom].adjacent.find((id) => id === target);
        if (!destination) return `You can't walk to "${arg.trim()}" from here.`;
        currentRoom = destination;
        visited.add(destination);
        return describeRoom(destination);
      },
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
