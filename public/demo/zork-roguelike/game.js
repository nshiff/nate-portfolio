/* ============================================================
   Search Party
   REPL shell + a randomised henchman case (Carmen Sandiego style):
   every load rolls a fresh culprit, stolen landmark, and off-world
   destination from pools; clues around town fan in on that truth.
   Soft failure only: a cooling "trail" makes the ending worse, never
   unwinnable.
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
  function shuffle(list) {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ----------------------------------------------------------
     Case pools. Kept in the established deadpan / Calvin-and-
     Hobbes register: cosmic thing, domestic framing.
     ---------------------------------------------------------- */

  // Six suspects. Tells are deliberately SHARED across the pool — three
  // garments, three drinks, three habits, spread so that no two suspects
  // share more than one. One confirmed tell narrows the field to two;
  // two tells pin exactly one. That's the deduction.
  const GARMENTS = ["a black turtleneck", "a too-large naval coat", "a reflective safety vest"];
  const DRINKS = ["warm milk", "flat tonic water", "cold tea, on purpose"];
  const HABITS = ["salutes inanimate objects", "labels other people's belongings", "narrates their own footsteps"];

  const SUSPECTS = [
    { name: "MR. FIVE-BY-FIVE", garment: GARMENTS[0], drink: DRINKS[0], habit: HABITS[0] },
    { name: "THE LAMPLIGHTER", garment: GARMENTS[2], drink: DRINKS[1], habit: HABITS[0] },
    { name: "AUNT PERPETUA", garment: GARMENTS[1], drink: DRINKS[0], habit: HABITS[1] },
    { name: "THE COMMODORE", garment: GARMENTS[1], drink: DRINKS[2], habit: HABITS[2] },
    { name: "LITTLE STANLEY", garment: GARMENTS[0], drink: DRINKS[1], habit: HABITS[2] },
    { name: "PROF. HALLOWAY", garment: GARMENTS[2], drink: DRINKS[2], habit: HABITS[1] },
  ];

  // Five town landmarks that can be the stolen loot.
  const LANDMARKS = [
    { name: "THE OBELISK", blurb: "40 tonnes of polished basalt, city centre, installed 1961" },
    { name: "THE BIG FERRIS WHEEL", blurb: "the fair's wheel, allegedly stuck since Tuesday" },
    { name: "THE FOUNDERS' FOUNTAIN", blurb: "bronze, three tiers, wishes since 1889" },
    { name: "THE LIBRARY LIONS", blurb: "a matched pair, one book each, extremely heavy" },
    { name: "THE OLD OAK", blurb: "the BIGTREE itself, roots and all, a municipal treasure" },
  ];

  // Five off-world destinations.
  const DESTINATIONS = [
    { name: "MOONLET", blurb: "a rented lump of rock in a slow orbit, currently 'the planet's garage'" },
    { name: "THE RING STATION", blurb: "a doughnut of scaffolding at the edge of the sky, mostly storage units" },
    { name: "LOW ORBIT", blurb: "not a place so much as an altitude, cold and full of paperwork" },
    { name: "THE DARK SIDE", blurb: "the far face of the moon, where the mail takes a week" },
    { name: "COMET 7", blurb: "a passing iceball; miss the window and it's back in 40 years" },
  ];

  /* ----------------------------------------------------------
     Case generation. Fills CASE with the rolled truth plus the
     resolved clue strings each room / NPC will hand out.
     ---------------------------------------------------------- */

  const CASE = {
    culprit: null,     // a SUSPECTS entry
    loot: null,        // a LANDMARKS entry
    dest: null,        // a DESTINATIONS entry
    distractors: [],   // two other SUSPECTS entries seen around town
    clues: {},         // slot id -> resolved string
    ruledOut: new Set(),
    heat: 100,
    solved: false,
    // --- the garage window: soft time pressure ---
    turn: 0,           // spent by walk/scan/talk/take
    window: 38,        // turns until the window slams
    trailStep: 0,      // how far along CULPRIT_TRAIL the culprit is
    caughtInPerson: false,
  };

  // The culprit walks this ahead of you, one hop every TRAIL_EVERY turns,
  // finishing (stepping off-world) after the last room. Scanning a room they
  // are in — or just left — gives a live, present-tense clue. Timed so a
  // thorough investigation (all tells + the slip, ~24 turns) arrives at the
  // RESERVOIR just as the culprit does; a content-skipping beeline gets there
  // early to an empty hangar and has to come back.
  const CULPRIT_TRAIL = ["FUNHOUSE", "BACKLOT", "UNDERPASS", "PUMPROOM", "RESERVOIR"];
  const TRAIL_EVERY = 5;   // turns per hop
  const TRAIL_HEADSTART = 4;
  // culprit at RESERVOIR from turn 4 + 4*5 = 24; window slams at 38.

  function rollCase() {
    CASE.culprit = pick(SUSPECTS);
    CASE.loot = pick(LANDMARKS);
    CASE.dest = pick(DESTINATIONS);
    const others = shuffle(SUSPECTS.filter((s) => s !== CASE.culprit));
    CASE.distractors = others.slice(0, 2);

    const c = CASE.culprit;
    const d1 = CASE.distractors[0];
    const d2 = CASE.distractors[1];

    CASE.clues = {
      // Loot: what was taken and that it's gone.
      loot: `The plaque is fine; the thing it names is missing. ${CASE.loot.name} (${CASE.loot.blurb}) has been pried loose and dragged off.`,
      // Culprit tells — describe the EVIDENCE, never name who it points to.
      // The player matches these against the suspects board themselves.
      "tell:garment": `Snagged on the door, still warm: ${c.garment}.`,
      "tell:drink": `The reserved booth's six-year tab is all one order: ${c.drink}. Paid in full tonight.`,
      "tell:habit": `Every witness mentions the same odd habit: the culprit ${c.habit}.`,
      // Distractors: two other suspects placed elsewhere with an alibi. Naming
      // them lets the board rule them out even if a tell coincidentally matches.
      "distractor:1": `${d1.name} was in the CAFE all evening — ${d1.garment}, three rounds of ${d1.drink} — and hasn't moved. Alibi holds.`,
      "distractor:2": `${d2.name} is on the TICKETBOOTH camera the whole time it happened, ${d2.garment}, arguing with the lock. Ruled out.`,
      // Destination: the payoff, only via scanning the RESERVOIR.
      dest: `The slip reads: cargo ${CASE.loot.name}, destination ${CASE.dest.name} — ${CASE.dest.blurb}.`,
      // Method / flavor that ties the trail together regardless of roll.
      method: `Whatever moved it left twin piano-height grooves from here toward the RESERVOIR.`,
    };

    CASE.ruledOut = new Set();
    CASE.heat = 100;
    CASE.solved = false;
    CASE.turn = 0;
    CASE.window = 38;
    CASE.trailStep = 0;
    CASE.caughtInPerson = false;
  }

  // Heat tiers gate one NPC and (as a fallback) the ending.
  function heatTier() {
    if (CASE.heat >= 80) return "hot";
    if (CASE.heat >= 45) return "warm";
    return "cold";
  }
  function coolTrail(amount) {
    CASE.heat = Math.max(0, CASE.heat - amount);
  }

  // How far the culprit has physically got. Frozen once the window slams
  // or the case is solved.
  function culpritStepNow() {
    if (CASE.solved) return CASE.trailStep;
    if (CASE.turn >= CASE.window) return CULPRIT_TRAIL.length; // gone
    const stepped = Math.floor((CASE.turn - TRAIL_HEADSTART) / TRAIL_EVERY) + 1;
    return Math.max(0, Math.min(CULPRIT_TRAIL.length, stepped));
  }
  function culpritRoomNow() {
    const s = culpritStepNow();
    return s >= 1 && s <= CULPRIT_TRAIL.length ? CULPRIT_TRAIL[s - 1] : null;
  }
  function culpritRoomPrev() {
    const s = culpritStepNow();
    return s >= 2 ? CULPRIT_TRAIL[s - 2] : null;
  }
  // Present-tense sighting for `scan`, or null if the culprit isn't near here.
  function sightingHere() {
    if (CASE.caughtInPerson) {
      return currentRoom === CULPRIT_TRAIL[CULPRIT_TRAIL.length - 1]
        ? `You've got them by the collar. They are not going anywhere. Name them.`
        : null;
    }
    const c = CASE.culprit;
    const lastStop = CULPRIT_TRAIL[CULPRIT_TRAIL.length - 1];
    if (culpritRoomNow() === currentRoom) {
      return currentRoom === lastStop
        ? `MOVEMENT. Someone in ${c.garment} is here right now, one foot on the rail. Walk in — this is your chance to take them in person.`
        : `MOVEMENT. Someone in ${c.garment} is here right now, working fast and not looking up. Still ahead of you, but not by much.`;
    }
    if (culpritRoomPrev() === currentRoom) {
      const nextRoom = CULPRIT_TRAIL[culpritStepNow() - 1] || "onward";
      return `Still warm: a chair, a paper cup, a snagged thread. They were here a moment ago and went ${nextRoom}.`;
    }
    return null;
  }
  function windowVibe() {
    const left = CASE.window - CASE.turn;
    if (left > 24) return "The garage window is wide open. Plenty of time.";
    if (left > 12) return "The garage window is closing. Keep moving.";
    if (left > 4) return "The garage window is about to slam. Move.";
    if (left > 0) return "The garage window is a crack. Now or postcard.";
    return "The garage window has slammed shut. Whatever's out there is out there for good.";
  }

  // Commands that cost a turn (i.e. advance the culprit / the window).
  const TIMED_COMMANDS = new Set(["walk", "scan", "talk", "take"]);
  function spendTurn() {
    if (CASE.solved) return;
    CASE.turn += 1;
    CASE.trailStep = culpritStepNow();
  }

  /* ----------------------------------------------------------
     World. Room prose is now mostly static set-dressing; the
     case-specific payload is a `clueSlot` id resolved at scan/
     talk/take time against CASE.clues.
     ---------------------------------------------------------- */

  const ROOMS = {
    BEDROOM: {
      description: "Your BEDROOM. A case file is open on the pillow, and tonight's is a big one.",
      adjacent: ["LIVINGROOM"],
      allowSleep: true,
      anomaly: "Scanner boots with a chirp. HOME. AMBIENT WEIRDNESS: 2%, all of it the sock pile.",
    },
    LIVINGROOM: {
      description: "A gorgeous rug with geometric patterns adorns the LIVINGROOM. The patterns are, on reflection, a star chart.",
      adjacent: ["BEDROOM", "FRONTLAWN"],
      allowSleep: true,
      anomaly: "The rug resolves to a navigation plot. Destination marker sits well off the edge of anything municipal. Someone vacuumed over the important part.",
    },
    FRONTLAWN: {
      description: "The grass on the FRONTLAWN could use a trim. One rectangular patch is pressed flat, as if something large parked here briefly and politely.",
      adjacent: ["LIVINGROOM", "DOWNTOWN", "CITYPARK", "FOREST"],
      anomaly: "Flattened patch: 4,200 kg, four contact points, departed upward. The grass under it is warm and smells of ozone and, oddly, funnel cake.",
    },
    DOWNTOWN: {
      description: "The hustle and bustle of DOWNTOWN. Every third pedestrian is holding a purple octopus plush and pretending they always have.",
      adjacent: ["FRONTLAWN", "CAFE", "STREETFAIR", "TAVERN"],
      anomaly: "Plush density: abnormal. Each octopus pings the same channel. They are, technically, a network.",
      clueSlot: "distractor:1",
    },
    CITYPARK: {
      description: "The CITYPARK has a playground, sporting facilities, and a commemorative plaque for something that isn't there anymore.",
      adjacent: ["FRONTLAWN", "BIGTREE", "FOUNTAIN", "OUTLOOK"],
      clueSlot: "loot",
      anomaly: "Mounting bolts sheared clean. Fresh drag marks. Scanner estimates the missing mass in the tens of tonnes and stops there.",
    },
    FOREST: {
      description: "Some peace and quiet in the FOREST. The birdsong loops every eleven seconds.",
      adjacent: ["FRONTLAWN", "STREAM", "TREEHOUSE", "VERYBIGTREE"],
      anomaly: "Birdsong is a four-bar sample on repeat. Under it, a low carrier tone. Something out here is politely holding a channel open.",
    },
    CAFE: {
      description: "Espresso hisses and cups clatter inside the CAFE. One corner booth has a RESERVED card that's been there, the barista will tell you, for six years.",
      adjacent: ["DOWNTOWN"],
      npc: "barista",
      clueSlot: "tell:drink",
      anomaly: "The reserved booth's table is scored with tiny parallel grooves, like someone rested something finned on it during a very long coffee.",
    },
    STREETFAIR: {
      description: "The STREETFAIR: a Ferris wheel stuck since Tuesday, every prize booth stocking the same purple octopus plush. The dunk-tank note reads BACK IN 5 MIN — GONE TO LAIR.",
      adjacent: ["DOWNTOWN", "FUNHOUSE", "TICKETBOOTH", "BACKLOT"],
      items: ["octopus plush"],
      npc: "operator",
      anomaly: "Every octopus swivels to track the scanner. Prize shelf: 1,400 identical plush, 0 delivery records. They did not arrive by truck.",
    },
    FUNHOUSE: {
      description: "FUNHOUSE mirrors, tall then wide. One shows a figure that clocks you, yelps, and speed-walks out of frame, dropping a clipboard.",
      adjacent: ["STREETFAIR"],
      items: ["clipboard"],
      clueSlot: "tell:habit",
      anomaly: "The odd mirror isn't a mirror. It's a window, and the room beyond is moving — slow, steady, fourteen-hours-of-travel kind of moving.",
    },
    TICKETBOOTH: {
      description: "The TICKETBOOTH is locked from the inside, a neat trick for an empty booth. Where the ticket roll should be: a logbook of ARRIVAL TIMES, tonight's row circled in crayon.",
      adjacent: ["STREETFAIR"],
      items: ["logbook"],
      anomaly: "Logbook entries geolocate to a single origin. Scanner declines to give the distance in kilometres and offers 'a lot'.",
      clueSlot: "distractor:2",
    },
    BACKLOT: {
      description: "One BACKLOT trailer is much bigger on the inside and smells like a photocopier that's seen things. Something's snagged on the door; twin drag marks lead toward the UNDERPASS.",
      adjacent: ["STREETFAIR", "UNDERPASS"],
      items: ["turtleneck"],
      clueSlot: "tell:garment",
      anomaly: "Trailer interior volume exceeds exterior by a factor of nine. The extra space is all corridor, sloping down toward the RESERVOIR.",
    },
    TAVERN: {
      description: "You can smell the booze and smoke in the TAVERN. One dart sits dead centre with a note under it: HELD MY DRINK.",
      adjacent: ["DOWNTOWN"],
      npc: "regular",
      anomaly: "A bar tab under a six-year name, one drink, every night, served in a booth that matches the CAFE's to the rivet.",
      clueSlot: "method",
    },
    BIGTREE: {
      description: "One massive oak, the BIGTREE, throws shade over half the lawn. Someone has carved a very neat rectangle into the trunk and a tiny arrow pointing down.",
      adjacent: ["CITYPARK"],
      allowSleep: true,
      anomaly: "The carved rectangle matches a landmark's base footprint to the millimetre. Measured recently, carefully, with a laser.",
    },
    FOUNTAIN: {
      description: "The FOUNTAIN water is running backwards — up the drain, down the spout, gone. A taped sign says WISHING TEMPORARILY DISABLED; the coins on the bottom form an arrow toward the UNDERPASS.",
      adjacent: ["CITYPARK", "UNDERPASS"],
      items: ["grey coin"],
      anomaly: "Water isn't going up, it's going out — a bore in the basin floor toward the RESERVOIR. The coin arrow was placed after, by someone with wet sleeves and a sense of humour.",
    },
    UNDERPASS: {
      description: "The UNDERPASS was built for a garden hose and is now big enough to drive a bus through, which someone clearly has. Walls gouged at piano-height; a cold blue glow and faint elevator music leak up from the PUMPROOM.",
      adjacent: ["FOUNTAIN", "BACKLOT", "PUMPROOM"],
      anomaly: "Scrape spacing is consistent: one object, tens of tonnes, dragged through here once, recently, toward the RESERVOIR. The elevator music is coming from inside the walls.",
    },
    PUMPROOM: {
      description: "City plumbing on one wall. On the other, a minivan-sized control panel, every button labelled in masking tape: UP, ALSO UP, DOWN (14 HRS), DO NOT. The RESERVOIR hatch has been cut open, edges still ticking as they cool.",
      adjacent: ["UNDERPASS", "RESERVOIR"],
      items: ["tape roll"],
      locked: { needs: "grey coin", hint: "The RESERVOIR hatch has a coin slot where a handle should be. Round, grey-coin sized." },
      anomaly: "The panel is a launch console in a plumbing costume. DOWN (14 HRS) is depressed and latched. A yellow legal pad taped to the side lists the plan in nine steps; step 9 is ACT NATURAL.",
    },
    RESERVOIR: {
      description: "The RESERVOIR was drained and re-lined to hold something big and rectangular, now gone. Skid marks lead off the edge into black water. A departure slip is pinned to a post.",
      adjacent: ["PUMPROOM"],
      anomaly: "The black water is a hangar door left open. Below it: rails, and a slip the scanner reads aloud.",
      reveal: "destination",
    },
    OUTLOOK: {
      description: "From the OUTLOOK you can see DOWNTOWN, the FOREST, and the STREETFAIR's stalled wheel. A coin-operated telescope is fixed, permanently, on a patch of sky above the FOUNTAIN.",
      adjacent: ["CITYPARK"],
      anomaly: "The telescope points past the FOUNTAIN, up, at a fixed patch of sky the scanner insists is not empty and is, in fact, getting closer at a leisurely pace.",
    },
    STREAM: {
      description: "Cold water runs clear over the stones of the STREAM. One stone is a perfect cube and slightly too warm.",
      adjacent: ["FOREST"],
      anomaly: "The cube stone is a half-buried relay forwarding the forest carrier tone up and to the left. A tiny brass plate: PLEASE DO NOT SKIP.",
    },
    TREEHOUSE: {
      description: "A rope ladder leads up to a rickety TREEHOUSE. Inside: a beanbag, a lantern, and a cork board of surveillance photos, all of the same reserved cafe booth.",
      adjacent: ["FOREST"],
      allowSleep: true,
      npc: "watcher",
      anomaly: "The cork board is a stakeout. Photos timestamped six years apart to the minute, same booth. Someone has been very patiently watching.",
    },
    VERYBIGTREE: {
      description: "You stand in awe of a VERYBIGTREE. It's so big it has its own weather and a small door at the base with a WELCOME mat.",
      adjacent: ["FOREST"],
      anomaly: "The small door opens on a broom closet: a folding chair, a thermos, and a hand-drawn town map with the RESERVOIR circled and HE'LL COME BACK THIS WAY underlined twice.",
    },
  };

  /* NPCs. Their `line` and `clueSlot` are resolved against CASE at talk time.
     `watcher` clams up when the trail goes cold. */
  const NPCS = {
    operator: {
      room: "STREETFAIR",
      line: () => `The dunk-tank operator, back and dripping: "Lair's a strong word. He rents. Said he was relocating a monument for a client — I assumed art people."`,
      clueSlot: "loot",
    },
    barista: {
      room: "CAFE",
      line: () => `The barista doesn't look up from the steamer. "Booth's a regular's. Six years, same order, no name. Paid the whole tab tonight and left."`,
      clueSlot: "tell:drink",
    },
    regular: {
      room: "TAVERN",
      line: () => `The regular squints. "They left an hour ago, toward the park. Said the garage window only stays open till the loot's reported. Owe me a rematch."`,
      clueSlot: "method",
    },
    watcher: {
      room: "TREEHOUSE",
      line: () => {
        if (heatTier() === "cold") {
          return `The person on the beanbag doesn't lower the binoculars. "You're late. I've got nothing for the late ones." They go back to watching.`;
        }
        return `The person on the beanbag lowers the binoculars. "Six years I've watched that booth. I can tell you what they wore, what they drank, and their one stupid habit. Which do you want? ...Fine, all three."`;
      },
      clueSlot: "all-tells",
    },
  };

  const START_ROOM = "BEDROOM";
  let currentRoom = START_ROOM;
  const visited = new Set([START_ROOM]);

  const inventory = new Set(["pocket scanner"]);

  const notebook = [];
  function noteClue(text) {
    if (text && !notebook.includes(text)) notebook.push(text);
  }
  // Resolve a room/NPC clue slot to its string(s) and file it.
  function fileSlot(slot) {
    if (!slot) return;
    if (slot === "all-tells") {
      noteClue(CASE.clues["tell:garment"]);
      noteClue(CASE.clues["tell:drink"]);
      noteClue(CASE.clues["tell:habit"]);
      autoRuleOut();
      return;
    }
    noteClue(CASE.clues[slot]);
    if (slot.startsWith("tell:") || slot.startsWith("distractor:")) autoRuleOut();
  }

  // Rule out the two named distractors once you've seen their alibi clue.
  function autoRuleOut() {
    if (notebook.includes(CASE.clues["distractor:1"])) CASE.ruledOut.add(CASE.distractors[0].name);
    if (notebook.includes(CASE.clues["distractor:2"])) CASE.ruledOut.add(CASE.distractors[1].name);
  }

  // Which culprit tells has the player confirmed? (garment / drink / habit)
  function knownTells() {
    return {
      garment: notebook.includes(CASE.clues["tell:garment"]),
      drink: notebook.includes(CASE.clues["tell:drink"]),
      habit: notebook.includes(CASE.clues["tell:habit"]),
    };
  }

  // A suspect "fits" if every tell you've confirmed matches theirs.
  function suspectFits(s) {
    const k = knownTells();
    if (k.garment && s.garment !== CASE.culprit.garment) return false;
    if (k.drink && s.drink !== CASE.culprit.drink) return false;
    if (k.habit && s.habit !== CASE.culprit.habit) return false;
    return true;
  }

  const SLEEP_FEELINGS = ["refreshed", "great, actually", "terrible", "groggy and vaguely accused of something", "like you dreamed in a language you don't speak", "like the octopus plush was in it", "ready to solve a mystery, or at least start one"];
  const SCAN_NO_GADGET = "No scanner. You put it down somewhere, which is a very you thing to do.";

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

  const ITEM_CLUE_SLOT = {
    turtleneck: "tell:garment",
    clipboard: "tell:habit",
    logbook: "distractor:2",
    "grey coin": null,
  };

  const COMMANDS = {
    whoami: {
      run: () => "player",
    },
    case: {
      run: () => {
        const lootKnown = notebook.includes(CASE.clues.loot);
        const lines = [
          "CASE BRIEF:",
          lootKnown
            ? `Stolen: ${CASE.loot.name}.`
            : "Stolen: something big. (Find out what — check the CITYPARK.)",
          "Someone lifted it off-world. You need to name the CULPRIT and the DESTINATION.",
          `Accuse when ready:  accuse <NAME> to <PLACE>`,
        ];
        return lines.join("\n");
      },
    },
    suspects: {
      run: () => {
        const k = knownTells();
        const confirmed = [];
        if (k.garment) confirmed.push(`wears ${CASE.culprit.garment}`);
        if (k.drink) confirmed.push(`drinks ${CASE.culprit.drink}`);
        if (k.habit) confirmed.push(`habit: ${CASE.culprit.habit}`);
        const head = confirmed.length
          ? `Evidence says the culprit: ${confirmed.join("; ")}.`
          : "No physical evidence on the culprit yet — scan the fair, talk to the watcher.";

        const anyEvidence = k.garment || k.drink || k.habit;
        const board = SUSPECTS.map((s) => {
          const tells = `(${s.garment}; ${s.drink}; ${s.habit})`;
          if (CASE.ruledOut.has(s.name)) return `  [alibi]  ${s.name} ${tells}`;
          if (anyEvidence && !suspectFits(s)) return `  [no fit] ${s.name} ${tells}`;
          return `  • ${s.name} ${tells}`;
        }).join("\n");

        const live = SUSPECTS.filter((s) => !CASE.ruledOut.has(s.name) && suspectFits(s));
        const tail = anyEvidence && live.length === 1
          ? `\n\nOnly one suspect fits: ${live[0].name}.`
          : "";
        return `${head}\n\nSUSPECTS:\n${board}${tail}`;
      },
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
        const clunk = gate && has(gate.needs);
        const culpritHere = !CASE.solved && culpritRoomNow() === destination;
        const lastStop = CULPRIT_TRAIL[CULPRIT_TRAIL.length - 1];
        currentRoom = destination;
        visited.add(destination);
        let out = (clunk ? `The ${gate.needs} fits the slot. CLUNK.\n\n` : "") + describeRoom(destination);

        if (culpritHere && destination === lastStop) {
          // The real intercept: catch them at the hangar before they step off.
          CASE.caughtInPerson = true;
          out += `\n\nAnd there they are, ${CASE.culprit.garment} and all, one foot on the rail. You get a hand on their collar. Now put a name to it and call it in — fast.`;
        } else if (culpritHere) {
          // Spotted earlier on the trail: they bolt for the next room.
          out += `\n\nYou catch a glimpse of ${CASE.culprit.garment} rounding the far side — then they're gone, deeper in. You're close.`;
        }
        return out;
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
        if (room.clueSlot) {
          fileSlot(room.clueSlot);
          const filed = room.clueSlot === "all-tells" ? null : CASE.clues[room.clueSlot];
          if (filed) out += `\n\n> noted: ${filed}`;
        }
        if (room.reveal === "destination") {
          fileSlot("dest");
          noteClue(CASE.clues.dest);
          out += `\n\n${CASE.clues.dest}\nWritten down. Now: accuse <NAME> to ${CASE.dest.name}.`;
        }
        const sighting = sightingHere();
        if (sighting) out += `\n\n${sighting}`;
        return out;
      },
    },
    window: {
      run: () => windowVibe(),
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
        if (Object.prototype.hasOwnProperty.call(ITEM_CLUE_SLOT, found)) {
          fileSlot(ITEM_CLUE_SLOT[found]);
        }
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
        if (who && who !== room.npc) return `You don't see "${who}" here. The person here is the ${room.npc}.`;
        const npc = NPCS[room.npc];
        const line = npc.line();
        // The watcher gives nothing when cold.
        if (!(room.npc === "watcher" && heatTier() === "cold")) {
          fileSlot(npc.clueSlot);
        }
        return line;
      },
    },
    notes: {
      run: () => {
        const clockLine = CASE.solved ? "" : `\n\n${windowVibe()}`;
        if (!notebook.length) return "Notebook empty. Scan rooms, talk to people, pick up anything too warm." + clockLine;
        return "CASE NOTES:\n" + notebook.map((c, i) => `${i + 1}. ${c}`).join("\n") + clockLine;
      },
    },
    accuse: {
      run: (arg) => {
        const raw = (arg || "").trim();
        if (CASE.solved) return "Case is closed. Refresh for a new one.";
        if (!raw) return `accuse <NAME> to <PLACE>. See "suspects" and "case".`;

        // Parse "NAME to PLACE" (also tolerate "NAME PLACE" and "NAME, PLACE").
        const m = raw.match(/^(.*?)\s+(?:to|,)\s+(.*)$/i);
        const namePart = (m ? m[1] : raw).trim().toUpperCase();
        const placePart = (m ? m[2] : "").trim().toUpperCase();

        const knowsDest = notebook.includes(CASE.clues.dest);
        if (!knowsDest) {
          return "You don't know where it went yet. The RESERVOIR has the departure slip — scan it.";
        }
        if (!placePart) {
          return `You've named a suspect but not a destination. Try: accuse ${namePart} to ${CASE.dest.name}.`;
        }

        // Forgiving match: exact, or the input is a distinctive chunk of the name
        // ("commodore" -> "THE COMMODORE", "five-by-five" -> "MR. FIVE-BY-FIVE").
        const nameKey = namePart.replace(/^(MR\.?|MRS\.?|MS\.?|DR\.?|PROF\.?|THE|LITTLE|AUNT)\s+/g, "").trim();
        const suspect = SUSPECTS.find((s) => {
          const sKey = s.name.replace(/^(MR\.?|MRS\.?|MS\.?|DR\.?|PROF\.?|THE|LITTLE|AUNT)\s+/g, "").trim();
          return s.name === namePart || sKey === nameKey || (nameKey.length >= 4 && sKey.includes(nameKey));
        });
        const nameRight = suspect && suspect === CASE.culprit;
        const placeRight = placePart === CASE.dest.name;

        if (nameRight && placeRight) {
          CASE.solved = true;
          input.disabled = true;
          // Catching the culprit in person beats any amount of cooled trail.
          const windowGone = CASE.turn >= CASE.window;
          const tier = CASE.caughtInPerson ? "caught"
            : windowGone ? "cold"
              : heatTier();
          const close = tier === "caught"
            ? `You had a hand on their collar before you finished the sentence. ${CASE.culprit.name} in a holding cell, ${CASE.loot.name} still on the dolly. The Ferris wheel starts turning like nothing happened.`
            : tier === "hot"
              ? `Clean. ${CASE.culprit.name} picked up at the gate, ${CASE.loot.name} still crated and barely cold.`
              : tier === "warm"
                ? `Messy but done. ${CASE.culprit.name} is halfway to ${CASE.dest.name} before the tug catches them; ${CASE.loot.name} comes back with a scratch and a customs form.`
                : `Eventually. ${CASE.loot.name} is recovered from ${CASE.dest.name} eight months later. ${CASE.culprit.name} sends a postcard. It's a nice postcard.`;
          return `Called in: ${CASE.culprit.name}, ${CASE.loot.name}, ${CASE.dest.name}.\n${close}\n\nCASE CLOSED. Type "exit", or refresh for a new case.`;
        }

        coolTrail(35);
        if (!suspect) {
          return `"${namePart}"? Not on the board. Check "suspects". The trail cools a little.`;
        }
        if (CASE.ruledOut.has(suspect.name)) {
          return `You already ruled ${suspect.name} out — your own notes contradict you. The trail cools. (heat: ${heatTier()})`;
        }
        if (!placeRight && !nameRight) {
          return `Wrong on both counts. Somewhere past the FOUNTAIN, a rock drifts further off. (heat: ${heatTier()})`;
        }
        if (nameRight) {
          return `Right person, wrong destination. ${CASE.culprit.name} is already moving. (heat: ${heatTier()})`;
        }
        return `Right destination, wrong person. ${suspect.name} has an alibi and now a grudge. (heat: ${heatTier()})`;
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
        return CASE.solved ? "Report filed. Simulation ended." : "Simulation ended.";
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

    const vibeBefore = windowVibe();
    print(command.run(rest.join(" ")));

    if (TIMED_COMMANDS.has(name) && !CASE.solved) {
      spendTurn();
      const vibeAfter = windowVibe();
      if (vibeAfter !== vibeBefore) print(vibeAfter);
    }
  }

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const value = input.value;
    input.value = "";
    handle(value);
  });

  rollCase();
  print('Type "help" for commands. "case" for the brief. The garage window is open — but not forever.\n\n');
  print(describeRoom(START_ROOM));
  input.focus();
})();
