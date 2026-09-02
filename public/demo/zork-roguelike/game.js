/* ============================================================
   Search Party
   REPL shell: input handling, built-in commands, color theme,
   and the henchman case: items, scanner, notebook, NPCs, accusation.
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

  /* ----------------------------------------------------------
     World: rooms, the items sitting in them, a scanner
     "anomaly" readout per room, and the people you can talk to.
     ---------------------------------------------------------- */

  const ROOMS = {
    BEDROOM: {
      description: "Your BEDROOM. Open case file on the pillow: one (1) missing henchman, last seen heading for the street fair with too much luggage.",
      adjacent: ["LIVINGROOM"],
      allowSleep: true,
      anomaly: "Scanner boots with a chirp. HOME. AMBIENT WEIRDNESS: 2%, all of it the sock pile. Nothing off-world here. Yet.",
    },
    LIVINGROOM: {
      description: "A gorgeous rug with geometric patterns adorns the LIVINGROOM. The patterns are, on reflection, a star chart.",
      adjacent: ["BEDROOM", "FRONTLAWN"],
      allowSleep: true,
      anomaly: "The rug's geometry resolves to a navigation plot. Destination marker sits well off the edge of anything municipal. Someone vacuumed over the important part.",
    },
    FRONTLAWN: {
      description: "The grass on the FRONTLAWN could use a trim. A single rectangular patch is pressed flat, as if something large and heavy parked here briefly and politely.",
      adjacent: ["LIVINGROOM", "DOWNTOWN", "CITYPARK", "FOREST"],
      anomaly: "Flattened patch reads: 4,200 kg, four contact points, departed upward. Grass underneath is faintly warm and smells of ozone and, oddly, funnel cake.",
    },
    DOWNTOWN: {
      description: "The hustle and bustle of DOWNTOWN. Every third pedestrian is holding a purple octopus plush and pretending they always have.",
      adjacent: ["FRONTLAWN", "CAFE", "STREETFAIR", "TAVERN"],
      anomaly: "Plush density: abnormal. Each octopus registers a faint transponder ping on the same channel. They are, technically, a network.",
    },
    CITYPARK: {
      description: "The CITYPARK boasts a playground, great sporting facilities, and a commemorative plaque for a monument that isn't there anymore.",
      adjacent: ["FRONTLAWN", "BIGTREE", "FOUNTAIN", "OUTLOOK"],
      anomaly: "Plaque dedicates 'THE OBELISK' — 40 tonnes of polished basalt, installed 1961. Scanner finds the mounting bolts sheared clean and a fresh set of piano-height drag marks.",
    },
    FOREST: {
      description: "Some peace and quiet in the FOREST. The birdsong loops every eleven seconds.",
      adjacent: ["FRONTLAWN", "STREAM", "TREEHOUSE", "VERYBIGTREE"],
      anomaly: "Birdsong is a four-bar sample on repeat. Underneath it, a low carrier tone. Something out here is politely holding a channel open.",
    },
    CAFE: {
      description: "Espresso hisses and cups clatter inside the CAFE. One corner booth has a RESERVED card that has been there, the barista will tell you, for six years.",
      adjacent: ["DOWNTOWN"],
      npc: "barista",
      anomaly: "The reserved booth's table is scored with the same parallel grooves as everywhere else, only tiny, like someone rested something with fins on it while they drank a very long coffee.",
    },
    STREETFAIR: {
      description: "The STREETFAIR: a Ferris wheel stuck since Tuesday, every prize booth stocking the same purple octopus plush. The dunk-tank note reads BACK IN 5 MIN — GONE TO LAIR.",
      adjacent: ["DOWNTOWN", "FUNHOUSE", "TICKETBOOTH", "BACKLOT"],
      items: ["octopus plush"],
      npc: "operator",
      anomaly: "Every octopus swivels to track the scanner. Prize shelf inventory: 1,400 identical plush, 0 delivery records. They did not arrive by truck.",
    },
    FUNHOUSE: {
      description: "FUNHOUSE mirrors, tall then wide. One just shows a nervous man in a black turtleneck; he clocks you, yelps, and speed-walks out of frame. A dropped clipboard reads STEP 4: ACT NATURAL.",
      adjacent: ["STREETFAIR"],
      items: ["clipboard"],
      anomaly: "The odd mirror isn't a mirror. It's a window, and the room on the far side is moving — slow, steady, fourteen-hours-of-travel kind of moving. The turtleneck man is in it, still checking his watch.",
    },
    TICKETBOOTH: {
      description: "The TICKETBOOTH is locked from the inside, which is a neat trick for an empty booth. Where the ticket roll should be: a logbook of ARRIVAL TIMES, tonight's row circled in crayon.",
      adjacent: ["STREETFAIR"],
      items: ["logbook"],
      anomaly: "Logbook entries geolocate to a single point of origin. Scanner declines to render the distance in kilometres and offers 'a lot' instead. Handler name in every row: MR. FIVE-BY-FIVE.",
    },
    BACKLOT: {
      description: "One BACKLOT trailer is much bigger on the inside and smells like a photocopier that's seen things. A black turtleneck is snagged on the door; two piano-wide drag marks lead off toward the UNDERPASS.",
      adjacent: ["STREETFAIR", "UNDERPASS"],
      items: ["turtleneck"],
      anomaly: "Trailer interior volume exceeds trailer exterior volume by a factor of nine. The extra space is all corridor, and the corridor slopes down toward the RESERVOIR at a grade no carnival permits.",
    },
    TAVERN: {
      description: "You can smell the booze and smoke in the TAVERN. The dartboard has one dart dead centre and a note under it reading 'HELD MY DRINK — F5B'.",
      adjacent: ["DOWNTOWN"],
      npc: "regular",
      anomaly: "Bar tab under the name F. BYFIVE runs to six years of a single drink: warm milk, no ice, served in the reserved booth's twin. Handwriting matches the crayon in the TICKETBOOTH.",
    },
    BIGTREE: {
      description: "One massive oak, the BIGTREE, throws shade over half the lawn. Someone has carved a very neat rectangle into the trunk and a tiny arrow pointing down.",
      adjacent: ["CITYPARK"],
      allowSleep: true,
      anomaly: "The carved rectangle matches the OBELISK's base footprint to the millimetre. Whoever measured it did so recently, carefully, and with a laser.",
    },
    FOUNTAIN: {
      description: "The FOUNTAIN water is running backwards — up the drain, down the spout, gone. A taped sign says WISHING TEMPORARILY DISABLED; the coins on the bottom form an arrow toward the UNDERPASS.",
      adjacent: ["CITYPARK", "UNDERPASS"],
      items: ["grey coin"],
      anomaly: "Water isn't going up. It's going out — drained through a bore in the basin floor toward the RESERVOIR. The coin arrow was placed after the water reversed, by someone with wet sleeves and a sense of humour.",
    },
    UNDERPASS: {
      description: "The UNDERPASS was built for a garden hose and is now big enough to drive a bus through, which someone clearly has. Walls gouged at piano-height; a cold blue glow and faint elevator music leak up from the PUMPROOM.",
      adjacent: ["FOUNTAIN", "BACKLOT", "PUMPROOM"],
      anomaly: "Scrape spacing is consistent: one object, forty tonnes, dragged through here exactly once, recently, in the direction of the RESERVOIR. The elevator music is coming from inside the walls.",
    },
    PUMPROOM: {
      description: "City plumbing on one wall. On the other, a minivan-sized control panel, every button labelled in masking tape: UP, ALSO UP, DOWN (14 HRS), DO NOT. The RESERVOIR hatch has been cut open, edges still ticking as they cool.",
      adjacent: ["UNDERPASS", "RESERVOIR"],
      items: ["tape roll"],
      locked: { needs: "grey coin", hint: "The RESERVOIR hatch has a coin slot where a handle should be. Round, grey-coin sized." },
      anomaly: "Panel is a launch console wearing a plumbing costume. DOWN (14 HRS) is depressed and latched. Destination bearing: straight down, then not down. A yellow legal pad taped to the side reads the whole plan in nine steps; step 9 is 'ACT NATURAL'.",
    },
    RESERVOIR: {
      description: "The RESERVOIR was drained and re-lined to hold something big and rectangular, now gone. Skid marks lead off the edge into black water. On a post: the black turtleneck, still warm, with a sticky note — BORROWED THE PLANET'S GARAGE, BACK LATER.",
      adjacent: ["PUMPROOM"],
      anomaly: "The black water is a hangar door left open. Below it: rails, a departure slip, and a forwarding address. Scanner reads the slip aloud: cargo THE OBELISK, handler MR. FIVE-BY-FIVE, destination — and here it finally gives you a name.",
      reveal: "destination",
    },
    OUTLOOK: {
      description: "From the OUTLOOK you can see DOWNTOWN, the FOREST, and the STREETFAIR's stalled Ferris wheel. A coin-operated telescope is fixed, permanently, on a patch of sky above the FOUNTAIN.",
      adjacent: ["CITYPARK"],
      anomaly: "The telescope isn't aimed at the FOUNTAIN. It's aimed past it, up, at a fixed point of empty sky that the scanner insists is not empty and is, in fact, getting closer at a leisurely pace.",
    },
    STREAM: {
      description: "Cold water runs clear over the stones of the STREAM. One stone is a perfect cube and slightly too warm.",
      adjacent: ["FOREST"],
      anomaly: "The cube stone is a relay, half-buried, forwarding that low forest carrier tone somewhere up and to the left. It has a tiny brass plate: PROPERTY OF F5B — PLEASE DO NOT SKIP.",
    },
    TREEHOUSE: {
      description: "A rope ladder leads up to a rickety TREEHOUSE. Inside: a beanbag, a lantern, and a cork board of surveillance photos, all of the same reserved cafe booth.",
      adjacent: ["FOREST"],
      allowSleep: true,
      anomaly: "The cork board is a stakeout. Every photo is timestamped, six years apart to the minute, same booth, same warm milk. Someone has been very patiently watching the henchman not do anything.",
    },
    VERYBIGTREE: {
      description: "You stand in awe of a VERYBIGTREE. It is so big it has its own weather and a small door at the base with a WELCOME mat.",
      adjacent: ["FOREST"],
      anomaly: "The small door opens on a broom closet containing a folding chair, a thermos, and a hand-drawn map of the whole town with the RESERVOIR circled and the words 'HE'LL COME BACK THIS WAY' underlined twice.",
    },
  };

  /* People. talk <who> returns flavor + drops a clue in the notebook. */
  const NPCS = {
    operator: {
      room: "STREETFAIR",
      lines: [
        "The dunk-tank operator, back and dripping: \"Lair's a strong word. He rents. Tips in grey coins. Said he was relocating a monument for a client — I assumed art people.\"",
      ],
      clue: "The henchman told the fair operator he was 'relocating a monument for a client.'",
    },
    barista: {
      room: "CAFE",
      lines: [
        "The barista doesn't look up from the steamer. \"Corner booth's his. Six years, warm milk, no name — everyone just calls him Mr. Five-by-Five. Paid the whole tab tonight and left.\"",
      ],
      clue: "The henchman is known locally as Mr. Five-by-Five (F5B); he settled a six-year tab tonight and left.",
    },
    regular: {
      room: "TAVERN",
      lines: [
        "The regular squints. \"Five-by-Five left an hour ago, toward the park. Said the garage window only stays open till the OBELISK's overdue. He owes me a rematch.\"",
      ],
      clue: "Mr. Five-by-Five left toward the park an hour ago, saying a 'garage window' is closing.",
    },
  };

  const START_ROOM = "BEDROOM";
  let currentRoom = START_ROOM;
  const visited = new Set([START_ROOM]);
  let won = false;

  /* Inventory. You start with the scanner. */
  const inventory = new Set(["pocket scanner"]);

  /* Notebook: ordered, de-duplicated one-liners the case has taught you. */
  const notebook = [];
  function noteClue(text) {
    if (!notebook.includes(text)) notebook.push(text);
  }

  /* The answer. Only ever printed once you've earned it (scanned RESERVOIR). */
  const DESTINATION = "MOONLET";
  const DESTINATION_BLURB = "a rented lump of rock in a slow orbit, currently 'the planet's garage'";

  const SLEEP_FEELINGS = ["refreshed", "great, actually", "terrible", "groggy and vaguely accused of something", "like you dreamed in a language you don't speak", "like the octopus plush was in it", "ready to solve a mystery, or at least start one"];

  const SCAN_NO_GADGET = "No scanner. You put it down somewhere, which is a very you thing to do.";

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function has(item) {
    return inventory.has(item);
  }

  function describeRoom(id) {
    const room = ROOMS[id];
    let text = `${room.description}\n\nExits: ${[...room.adjacent].sort().join(", ")}`;
    if (room.items && room.items.length) {
      text += `\nHere: ${[...room.items].sort().join(", ")}`;
    }
    if (room.npc && NPCS[room.npc]) {
      text += `\nSomeone to talk to.`;
    }
    return text;
  }

  /* Clues that land just from being somewhere / carrying something. */
  function passiveClues() {
    if (currentRoom === "FUNHOUSE") {
      noteClue("The henchman wears a black turtleneck and was last seen through the odd mirror, aboard something in motion.");
    }
    if (currentRoom === "CITYPARK") {
      noteClue("A 40-tonne monument, THE OBELISK, has been pried off its base and dragged away.");
    }
    if (currentRoom === "RESERVOIR" && has("turtleneck")) {
      noteClue("The henchman left his turtleneck behind, still warm, with a note about borrowing 'the planet's garage'.");
    }
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
        const gate = ROOMS[destination].locked;
        if (gate && !has(gate.needs)) {
          return `${destination} is blocked. ${gate.hint}`;
        }
        if (gate && has(gate.needs)) {
          currentRoom = destination;
          visited.add(destination);
          passiveClues();
          return `The ${gate.needs} fits the slot. CLUNK.\n\n${describeRoom(destination)}`;
        }
        currentRoom = destination;
        visited.add(destination);
        passiveClues();
        return describeRoom(destination);
      },
    },
    look: {
      run: () => describeRoom(currentRoom),
    },
    scan: {
      run: () => {
        if (!has("pocket scanner")) return SCAN_NO_GADGET;
        const room = ROOMS[currentRoom];
        let out = room.anomaly || "Scanner finds nothing unusual. It sounds disappointed.";
        if (room.reveal === "destination") {
          noteClue(`The henchman (Mr. Five-by-Five) has taken THE OBELISK to ${DESTINATION} — ${DESTINATION_BLURB}.`);
          out += `\n\nDESTINATION: ${DESTINATION}. Written down. Try "accuse ${DESTINATION}".`;
        }
        return out;
      },
    },
    take: {
      run: (arg) => {
        const want = (arg || "").trim().toLowerCase();
        if (!want) return "Take what?";
        const room = ROOMS[currentRoom];
        const found = (room.items || []).find((i) => i.toLowerCase() === want);
        if (!found) return `There's no ${want} here to take.`;
        room.items = room.items.filter((i) => i !== found);
        inventory.add(found);
        if (found === "logbook") noteClue("The TICKETBOOTH logbook records off-world ARRIVALS handled by MR. FIVE-BY-FIVE.");
        if (found === "clipboard") noteClue("The henchman's clipboard lays out a numbered plan; the last step is 'ACT NATURAL'.");
        if (found === "grey coin") noteClue("Grey off-world coins double as door handles underground — the henchman tips in them.");
        return `Taken: ${found}.`;
      },
    },
    drop: {
      run: (arg) => {
        const want = (arg || "").trim().toLowerCase();
        if (!want) return "Drop what?";
        const held = [...inventory].find((i) => i.toLowerCase() === want);
        if (!held) return `You're not carrying a ${want}.`;
        if (held === "pocket scanner") return "You could put the scanner down, but past-you already tried that and look how that went. You keep it.";
        inventory.delete(held);
        const room = ROOMS[currentRoom];
        room.items = room.items || [];
        room.items.push(held);
        return `Dropped: ${held}.`;
      },
    },
    inventory: {
      run: () => {
        if (!inventory.size) return "Carrying nothing. Not even the scanner. Bold.";
        return "Carrying: " + [...inventory].sort().join(", ");
      },
    },
    talk: {
      run: (arg) => {
        const who = (arg || "").trim().toLowerCase();
        const room = ROOMS[currentRoom];
        if (!room.npc || !NPCS[room.npc]) return "There's nobody here worth talking to.";
        const npc = NPCS[room.npc];
        if (who && who !== room.npc) return `You don't see "${who}" here. The person here is the ${room.npc}.`;
        noteClue(npc.clue);
        return npc.lines.join("\n");
      },
    },
    notes: {
      run: () => {
        if (!notebook.length) return "Notebook empty. Scan rooms, talk to people, pick up anything too warm.";
        return "CASE NOTES:\n" + notebook.map((c, i) => `${i + 1}. ${c}`).join("\n");
      },
    },
    accuse: {
      run: (arg) => {
        const guess = (arg || "").trim().toUpperCase();
        const knowsDestination = notebook.some((c) => c.includes(DESTINATION));
        if (!guess) {
          return knowsDestination
            ? `Where did he take THE OBELISK? "accuse ${DESTINATION}".`
            : "You don't actually know where he went yet. Try scanning the RESERVOIR.";
        }
        if (!knowsDestination) {
          return "You announce a destination you haven't established. A pigeon looks unimpressed. Get proof first.";
        }
        if (guess !== DESTINATION) {
          return `"${guess}?" WRONG. Out past the FOUNTAIN, a rented rock drifts a little further off. Check your notes.`;
        }
        won = true;
        input.disabled = true;
        return [
          `Called in: THE OBELISK, taken by Mr. Five-by-Five to ${DESTINATION}.`,
          "A long pause on the radio. \"...Huh. Nice work.\"",
          "The Ferris wheel, unprompted, resumes turning.",
          "",
          "CASE CLOSED. Type \"exit\", or refresh to play again.",
        ].join("\n");
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
        return won ? "Report filed. Simulation ended." : "Simulation ended.";
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
