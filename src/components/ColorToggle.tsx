import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import styles from "./ColorToggle.module.css";

/* ================================================================== */
/* The "language": each command is a NAME -> Command entry.            */
/* `run` receives the whitespace-split args after the command name.    */
/* `usage` and `description` feed the HELP listing automatically.      */
/* ================================================================== */

const REPL_COLORS = ["green", "amber", "white"] as const;
type ReplColor = (typeof REPL_COLORS)[number];

const isReplColor = (value: string | undefined): value is ReplColor =>
  (REPL_COLORS as readonly string[]).includes(value ?? "");

/** What a command is allowed to do to the terminal besides printing. */
interface ReplContext {
  setColor: (color: ReplColor) => void;
}

/** Throw this for user mistakes; the message is printed as-is. */
class CommandError extends Error { }

/** Unix `date` style, in the viewer's local time: "Tue Nov 17 04:59:12 EST 2026" */
function formatUnixDate(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
    year: "numeric",
  }).formatToParts(d);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${get("weekday")} ${get("month")} ${get("day")} ${get("hour")}:${get("minute")}:${get("second")} ${get("timeZoneName")} ${get("year")}`;
}

const FORTUNES = [
  "A bug you fixed long ago will return. It remembers you.",
  "You will soon refactor something that did not need refactoring. It will be worth it.",
  "The answer you seek is in the logs. It always was.",
  "Beware of off-by-one errors. Also beware of off-by-one errors.",
  "Someone is thinking of you right now. It is your linter.",
  "A great adventure awaits, but first, npm install.",
  "Today is a good day to write the test first. Tomorrow will also be fine.",
  "You will find what you are looking for in the last place you look. Use grep.",
  "Your next commit message will be honest.",
  "The calculator in your drawer still believes in you.",
  "An unexpected semicolon will change your life.",
  "Fortune favors the developer who reads the error message.",
  "You are one console.log away from understanding everything.",
  "The cache is not the problem. The cache is never the problem. Check the cache.",
  "A stranger will ask you to center a div. Be kind.",
  "Good things come to those who wait. Better things come to those who add an index.",
  "Your rubber duck knows more than it lets on.",
  "Lucky numbers: 0, 1, 404, 418, 8080.",
  "It works on your machine. Your machine is wise.",
  "You will soon type a command that does not exist yet. Then you will build it.",
  "The prophecy is unclear. Try again after a full reload.",
  "Ask again later. The oracle is compiling.",
];

let lastFortune = -1;

function pickFortune(): string {
  let i: number;
  do {
    i = Math.floor(Math.random() * FORTUNES.length);
  } while (i === lastFortune && FORTUNES.length > 1);
  lastFortune = i;
  return FORTUNES[i];
}

interface Command {
  /** How to call it, shown in HELP. Omit for commands that take no args. */
  usage?: string;
  /** One-line summary, shown in HELP. */
  description: string;
  run: (args: string[], ctx: ReplContext) => string;
}

const commands: Record<string, Command> = {
  ABOUT: {
    description: "Show what this is",
    run: () => "A TypeScript experiment from Opus 5.5",
  },

  COLOR: {
    usage: REPL_COLORS.join(" | "),
    description: "Change the terminal color",
    run: (args, ctx) => {
      const choice = args[0]?.toLowerCase();
      if (args.length !== 1 || !isReplColor(choice)) {
        throw new CommandError(`Usage: COLOR ${REPL_COLORS.join(" | ")}`);
      }
      ctx.setColor(choice);
      return `Color set to ${choice}.`;
    },
  },

  DATE: {
    description: "Show the current date and time",
    run: (args) => {
      if (args.length > 0) throw new CommandError("Usage: DATE");
      return formatUnixDate(new Date());
    },
  },

  FORTUNE: {
    description: "Consult the oracle",
    run: (args) => {
      if (args.length > 0) throw new CommandError("Usage: FORTUNE");
      return pickFortune();
    },
  },

  HELP: {
    description: "List available commands",
    run: () => {
      const rows = Object.entries(commands)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, cmd]) => [cmd.usage ? `${name} ${cmd.usage}` : name, cmd.description]);
      const width = Math.max(...rows.map(([call]) => call.length));
      return [
        "Available commands:",
        ...rows.map(([call, desc]) => `  ${call.padEnd(width)}  ${desc}`),
      ].join("\n");
    },
  },
};

type EvalResult =
  | { kind: "output"; text: string }
  | { kind: "error"; text: string }
  | { kind: "none" };

function evaluate(input: string, ctx: ReplContext): EvalResult {
  const tokens = input.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return { kind: "none" };

  const [rawName, ...args] = tokens;
  const name = rawName.toUpperCase();
  const command = commands[name];

  if (!command) return { kind: "error", text: `Unknown command: ${rawName}` };

  try {
    return { kind: "output", text: command.run(args, ctx) };
  } catch (err) {
    if (err instanceof CommandError) return { kind: "error", text: err.message };
    const message = err instanceof Error ? err.message : String(err);
    return { kind: "error", text: `Error in ${name}: ${message}` };
  }
}

/* ================================================================== */
/* REPL                                                                */
/* ================================================================== */

type LineKind = "input" | "output" | "error";

interface Line {
  id: number;
  kind: LineKind;
  text: string;
}

const PROMPT = ">";

const colorClass: Record<ReplColor, string> = {
  green: styles.fgGreen,
  amber: styles.fgAmber,
  white: styles.fgWhite,
};

function Repl() {
  const [lines, setLines] = useState<Line[]>([]);
  const [color, setColor] = useState<ReplColor | null>(null);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the newest output in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const append = (...newLines: Omit<Line, "id">[]) =>
    setLines((prev) => [...prev, ...newLines.map((l) => ({ ...l, id: nextId.current++ }))]);

  const submit = () => {
    const entry = input;
    setInput("");
    setHistoryIndex(null);
    if (entry.trim()) setHistory((h) => [...h, entry]);

    const result = evaluate(entry, { setColor });
    const echo = { kind: "input" as const, text: entry };
    if (result.kind === "none") append(echo);
    else append(echo, { kind: result.kind, text: result.text });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp") {
      if (history.length === 0) return;
      e.preventDefault();
      const i = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(i);
      setInput(history[i]);
    } else if (e.key === "ArrowDown") {
      if (historyIndex === null) return;
      e.preventDefault();
      const i = historyIndex + 1;
      if (i >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(i);
        setInput(history[i]);
      }
    }
  };

  return (
    <div
      className={color ? `${styles.terminal} ${colorClass[color]}` : styles.terminal}
      ref={scrollRef}
      onClick={() => {
        // Don't steal focus if the user is selecting text to copy.
        if (!window.getSelection()?.toString()) inputRef.current?.focus();
      }}
    >
      <div role="log" aria-live="polite" aria-label="REPL output">
        {lines.map((line) => (
          <div key={line.id} className={styles.line}>
            {line.kind === "input" && <span className={styles.prompt}>{PROMPT}</span>}
            {line.text}
          </div>
        ))}
      </div>

      <div className={styles.inputRow}>
        <span className={styles.prompt} aria-hidden="true">{PROMPT}</span>
        <input
          ref={inputRef}
          className={styles.field}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="REPL input"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

/* ================================================================== */
/* Page                                                                */
/* ================================================================== */

export default function ColorToggle() {
  return (
    <div className={styles.container}>
      <Repl />
    </div>
  );
}