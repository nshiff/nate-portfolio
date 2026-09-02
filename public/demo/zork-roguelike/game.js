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
      description: "Your BEDROOM. Unmade bed, sock situation on the floor, and a case file open on the pillow: one (1) missing henchman, last seen heading for the street fair with a suspicious amount of luggage. Time to go.",
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
      adjacent: ["LIVINGROOM", "DOWNTOWN", "CITYPARK", "FOREST"],
    },
    DOWNTOWN: {
      description: "The hustle and bustle of DOWNTOWN.",
      adjacent: ["FRONTLAWN", "CAFE", "STREETFAIR", "TAVERN"],
    },
    CITYPARK: {
      description: "The CITYPARK boasts a playground and great sporting facilities.",
      adjacent: ["FRONTLAWN", "BIGTREE", "FOUNTAIN", "OUTLOOK"],
    },
    FOREST: {
      description: "Some peace and quiet in the FOREST.",
      adjacent: ["FRONTLAWN", "STREAM", "TREEHOUSE", "VERYBIGTREE"],
    },
    CAFE: {
      description: "Espresso hisses and cups clatter inside the CAFE.",
      adjacent: ["DOWNTOWN"],
    },
    STREETFAIR: {
      description: "Funnel cake, ring toss, a Ferris wheel stuck mid-turn since Tuesday. Every prize booth at the STREETFAIR stocks the exact same purple octopus plush, and every octopus is looking at you. The guy running the dunk tank left a note: BACK IN 5 MIN — GONE TO LAIR.",
      adjacent: ["DOWNTOWN", "FUNHOUSE", "TICKETBOOTH", "BACKLOT"],
    },
    FUNHOUSE: {
      description: "The FUNHOUSE mirrors make you tall, then wide, then tall again. One mirror, though, just shows a nervous man in a black turtleneck checking his watch. He notices you noticing him, yelps, and speed-walks out of frame. A dropped clipboard reads STEP 4: ACT NATURAL.",
      adjacent: ["STREETFAIR"],
    },
    TICKETBOOTH: {
      description: "The TICKETBOOTH is locked from the inside, which is a neat trick for an empty booth. The ticket roll has been replaced with a logbook of ARRIVAL TIMES and a column labeled FROM: WAY FURTHER THAN YOU'D THINK. Tonight's row is circled in crayon.",
      adjacent: ["STREETFAIR"],
    },
    BACKLOT: {
      description: "Behind the BACKLOT fence, one carnival trailer is much bigger on the inside and smells like a photocopier that's seen things. A black turtleneck is snagged on the door. Two enormous drag marks lead off toward the UNDERPASS, like someone wheeled a piano down a ramp and kept going.",
      adjacent: ["STREETFAIR", "UNDERPASS"],
    },
    TAVERN: {
      description: "You can smell the booze and smoke in the TAVERN.",
      adjacent: ["DOWNTOWN"],
    },
    BIGTREE: {
      description: "One massive oak, the BIGTREE, throws shade over half the lawn.",
      adjacent: ["CITYPARK"],
      allowSleep: true,
    },
    FOUNTAIN: {
      description: "Tourists stand around the FOUNTAIN taking photos, except the water is running backwards — up the drain, down the spout, gone. A hand-lettered sign taped to the rim says WISHING TEMPORARILY DISABLED. Somebody's arranged the coins on the bottom into a big arrow pointing at the UNDERPASS.",
      adjacent: ["CITYPARK", "UNDERPASS"],
    },
    UNDERPASS: {
      description: "The UNDERPASS was built for a garden hose and is now big enough to drive a bus through, which someone clearly has. The walls are gouged with parallel scrapes at exactly piano-height. A cold blue glow leaks up from the PUMPROOM, along with faint elevator music.",
      adjacent: ["FOUNTAIN", "BACKLOT", "PUMPROOM"],
    },
    PUMPROOM: {
      description: "City plumbing on one wall. On the other, a control panel the size of a minivan, every button hand-labeled with masking tape: UP, ALSO UP, DOWN (14 HRS), DO NOT. The RESERVOIR hatch has been cut open with something far too hot for the job, and the edges are still going tick... tick... as they cool.",
      adjacent: ["UNDERPASS", "RESERVOIR"],
    },
    RESERVOIR: {
      description: "The RESERVOIR has been drained and re-lined to hold something big and rectangular, which is no longer here. Skid marks lead off the edge and straight down into black water. On a post by the rail, folded with real care, sits the black turtleneck — still warm, with a sticky note: BORROWED THE PLANET'S GARAGE, BACK LATER.",
      adjacent: ["PUMPROOM"],
    },
    OUTLOOK: {
      description: "From the OUTLOOK you can see DOWNTOWN, your neighborhood, the FOREST, and — if you squint — the STREETFAIR, where a Ferris wheel is very much not turning. Someone's left a coin-operated telescope permanently aimed at the FOUNTAIN.",
      adjacent: ["CITYPARK"],
    },
    STREAM: {
      description: "Cold water runs clear over the stones of the STREAM.",
      adjacent: ["FOREST"],
    },
    TREEHOUSE: {
      description: "A rope ladder leads up to a rickety TREEHOUSE.",
      adjacent: ["FOREST"],
      allowSleep: true,
    },
    VERYBIGTREE: {
      description: "You stand in awe of a VERYBIGTREE.",
      adjacent: ["FOREST"],
    },
  };

  const START_ROOM = "BEDROOM";
  let currentRoom = START_ROOM;
  const visited = new Set([START_ROOM]);

  const SLEEP_FEELINGS = ["refreshed", "great, actually", "terrible", "groggy and vaguely accused of something", "like you dreamed in a language you don't speak", "like the octopus plush was in it", "ready to solve a mystery, or at least start one"];

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function describeRoom(id) {
    const room = ROOMS[id];
    const adjacent = [...room.adjacent].sort();
    return `${room.description}\n\nYou are adjacent to:\n${adjacent.join(", ")}`;
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
        if (!target) return "Walk where? Try \"walk ROOMNAME\" to an adjacent room.";
        const destination = ROOMS[currentRoom].adjacent.find((id) => id === target);
        if (!destination) return `You can't walk to "${arg.trim()}" from here.`;
        currentRoom = destination;
        visited.add(destination);
        return describeRoom(destination);
      },
    },
    look: {
      run: () => describeRoom(currentRoom),
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
