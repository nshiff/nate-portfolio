/* ============================================================
   Search Party
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

  const COMMANDS = {
    whoami: {
      help: "whoami — print the current player name",
      run: () => "player",
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

  print("Search Party.");
  print('Type "help" to see available commands.');
  input.focus();
})();
