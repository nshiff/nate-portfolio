import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';

type Line = {
  id: number;
  kind: 'echo' | 'output';
  text: string;
};

export type TerminalTheme = {
  fg: string;
  bg: string;
};

type TerminalProps = {
  /** Printed once, before any input. */
  intro: string;
  /** Called with each non-blank submission; returns the text to print, or null to print nothing. */
  onCommand: (input: string) => string | null;
  /** Text and background colours; a change fades in. */
  theme?: TerminalTheme;
};

// Oldest lines are dropped past this, so a long session can't grow the DOM without bound.
const MAX_LINES = 500;

const DEFAULT_THEME: TerminalTheme = { fg: '#33ff66', bg: '#0a0a0a' };

const FADE = 'background-color 0.4s, color 0.4s, border-color 0.4s';

const TEXT: CSSProperties = {
  fontSize: '1.125rem',
  fontWeight: 'bold',
  lineHeight: 1.6,
};

export function Terminal({ intro, onCommand, theme = DEFAULT_THEME }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>([{ id: 0, kind: 'output', text: intro }]);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  // Position while browsing history with the arrow keys; null means a fresh line.
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the newest line in view. Layout effect, so it scrolls before the browser paints.
  useLayoutEffect(() => {
    const output = outputRef.current;
    if (output) {
      output.scrollTop = output.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  function append(items: Omit<Line, 'id'>[]) {
    setLines((prev) => {
      let id = prev.length ? prev[prev.length - 1].id + 1 : 0;
      const next = [...prev, ...items.map((item) => ({ ...item, id: id++ }))];
      return next.slice(-MAX_LINES);
    });
  }

  function submit() {
    const input = value.trim();
    setValue('');
    setHistoryIndex(null);
    if (!input) {
      return;
    }

    if (history[history.length - 1] !== input) {
      setHistory([...history, input]);
    }
    const output = onCommand(input);
    append(output === null
      ? [{ kind: 'echo', text: input }]
      : [{ kind: 'echo', text: input }, { kind: 'output', text: output }]);
  }

  function showHistory(index: number | null) {
    setHistoryIndex(index);
    setValue(index === null ? '' : history[index]);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      submit();
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      showHistory(historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1));
    } else if (e.key === 'ArrowDown' && historyIndex !== null) {
      e.preventDefault();
      showHistory(historyIndex + 1 < history.length ? historyIndex + 1 : null);
    }
  }

  // Tapping anywhere in the terminal focuses the input -- unless the tap was
  // the end of selecting text to copy.
  function handleClick() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{
        '--fg': theme.fg,
        '--bg': theme.bg,
        // The input bar and its border are tints of the theme, so a theme is just two colours.
        '--panel': 'color-mix(in srgb, var(--fg) 6%, var(--bg))',
        '--border': 'color-mix(in srgb, var(--fg) 20%, var(--bg))',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg)',
        color: 'var(--fg)',
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        transition: FADE,
      } as CSSProperties}
    >
      <div
        ref={outputRef}
        role="log"
        aria-label="Terminal output"
        style={{
          ...TEXT,
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {lines.map((line) => (
          <div
            key={line.id}
            style={line.kind === 'echo'
              ? { marginTop: '1.6em', opacity: 0.7 }
              : undefined}
          >
            {/* Uppercased in the text, not with CSS, so a copied echo matches what is shown. */}
            {line.kind === 'echo' ? `> ${line.text.toUpperCase()}` : line.text}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.75rem 1rem',
          borderTop: '1px solid var(--border)',
          background: 'var(--panel)',
          flexShrink: 0,
          transition: FADE,
        }}
      >
        <span aria-hidden="true" style={{ ...TEXT, marginRight: '0.5rem', userSelect: 'none' }}>&gt;</span>
        <input
          ref={inputRef}
          type="text"
          aria-label="Command"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck={false}
          enterKeyHint="send"
          style={{
            ...TEXT,
            flex: 1,
            minWidth: 0,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'inherit',
            fontFamily: 'inherit',
            textTransform: 'uppercase',
          }}
        />
      </div>
    </div>
  );
}
