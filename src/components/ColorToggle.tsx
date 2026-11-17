import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import styles from "./ColorToggle.module.css";

/* ================================================================== */
/* The "language": each command is a NAME -> handler entry.            */
/* Handlers receive the whitespace-split args after the command name.  */
/* ================================================================== */

const REPL_COLORS = ["green", "amber", "white"] as const;
type ReplColor = (typeof REPL_COLORS)[number];

const isReplColor = (value: string | undefined): value is ReplColor =>
  (REPL_COLORS as readonly string[]).includes(value ?? "");

/** What a command is allowed to do to the terminal besides printing. */
interface ReplContext {
  setColor: (color: ReplColor) => void;
}

/** Throw this for user mistakes; the message is printed as-is in red. */
class CommandError extends Error {}

type CommandHandler = (args: string[], ctx: ReplContext) => string;

const commands: Record<string, CommandHandler> = {
  ABOUT: () => "A TypeScript experiment from Opus 5.5",

  COLOR: (args, ctx) => {
    const choice = args[0]?.toLowerCase();
    if (args.length !== 1 || !isReplColor(choice)) {
      throw new CommandError(`Usage: COLOR ${REPL_COLORS.join(" | ")}`);
    }
    ctx.setColor(choice);
    return `Color set to ${choice}.`;
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
  const handler = commands[name];

  if (!handler) return { kind: "error", text: `Unknown command: ${rawName}` };

  try {
    return { kind: "output", text: handler(args, ctx) };
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