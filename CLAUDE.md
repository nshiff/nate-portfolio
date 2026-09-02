For fun, please greet the user in a random language to begin the conversation.

## Workflow

- **Do not run `git commit` or create branches for committing.** The developer controls commit messages, timing, and size himself. Make the changes, run the checks, report what changed, and stop. They will commit. The repo's normal flow is committing directly to `main` — don't branch "to keep main clean" unless asked.
- **Iterative by design.** The developer often builds features in small increments and pivots scope mid-stream. This is partly deliberate — it's how they check that new work follows the repo's informal conventions before trusting it with more. Don't rush to lock scope early or over-build ahead of where they have asked.
- **Verify before asserting.** After edits: `npm run build` (runs `tsc -b` then `vite build`) and `npm run test:e2e` for anything touching a demo. Report failures with the output; don't claim done without the check.

## Shape of the app

Client-only **React 19 + TypeScript SPA** (Vite, react-router v8 data router), no backend. `src/App.tsx` defines one shared `Layout` (header/nav/footer) wrapping a `Home` route plus **one explicit route per project** (`/project/01`, `/project/02`, …) — there is no dynamic `/project/:id` route.

**Adding a project touches three places:**
1. `src/data/projects.ts` — append a `Project` object (`id`, `title`, `description`, `emoji`, `background` gradient, `category`). IDs are zero-padded two-digit strings and are **not contiguous** (grouped by category in the array; some numbers absent on purpose — e.g. `17` was removed over an unfixable Vite dev-server warning, `18` skipped in routes).
2. `src/pages/ProjectNN.tsx` — a new page component.
3. `src/App.tsx` — a new route entry **and** the matching top-of-file `import`.

## Conventions

- **Styling is vanilla CSS.** Inline `style={{}}` objects using CSS custom properties: `var(--text-secondary)`, `var(--accent-color)`, `var(--border-color)`, etc. Tailwind is a dependency but is an **intentional one-off** — only `ModularSynth.jsx` uses it (that's how Gemini built it). Don't reach for Tailwind classes on new work.
- **Most demos are sandboxed iframes.** The page component renders `<iframe src="/demo/whatever.html">` pointing at a fully self-contained static HTML file in `public/demo/` — its own `<script>` tags, no build step, no access to the app's React tree. This is the default pattern; prefer it.
- **Inline React demos are the exception, not a pattern to extend.** A few (`ModularSynth`, `DoubleSlitVisualization`, `NavigatorDashboard`) are `.jsx` files in `src/components/` with a hand-written sibling `.d.ts`, imported into the page tree. They exist because they were dropped in from AI-generated canvases with minimal porting.
- **Provenance is part of the product.** The README and several project pages credit AI tools (Gemini Canvas, Claude) as co-authors of individual demos, with source links back to `public/demo/*.html` on GitHub. This portfolio partly showcases AI-assisted build velocity — weigh that when deciding how much to polish vs. preserve a piece's "as generated" character.

## Testing (Playwright)

- `@playwright/test` is a real devDependency (Chromium in `~/.cache/ms-playwright`). Run with `npm run test:e2e`. `playwright.config.ts` auto-starts `npm run dev` and points at `http://localhost:5173`.
- A Playwright script only resolves `@playwright/test` from **inside the repo tree** (needs `node_modules`) — a `/tmp` or scratchpad script fails with `ERR_MODULE_NOT_FOUND`. Put throwaway specs in `e2e/` (e.g. `e2e/_tmp-*.spec.ts`), run them, then delete them — or, if one is a genuinely good regression guard, keep it.
- `e2e/home.spec.ts` is a smoke spec. `e2e/search-party.spec.ts` is the permanent suite for the Project 20 demo (`public/demo/zork-roguelike/`).
- e2e specs pin **exact substrings** of demo output. Re-run the relevant spec after any copy/text change in a demo, not just logic changes.

## Project 20 — Search Party (`public/demo/zork-roguelike/`)

It's a **small text-adventure world**: two files, `index.html` (dark terminal UI) and `game.js` (the whole game — a short IIFE). Currently deliberately minimal: around six rooms (`BEDROOM ↔ LIVINGROOM ↔ FRONTLAWN`, then `FRONTLAWN` forks to dead-end leaves `DOWNTOWN` / `CITYPARK` / `FOREST`), around six verbs (`look`, `map`, `sleep`, `walk`, `color`, `help`), no case/clock/NPCs/items. It has been torn down and rebuilt more than once — **treat the code as current truth.**

- **Command model:** one `COMMANDS` object, `{ name: { run: (arg) => "output string" } }`. Adding a command is a one-entry change. There is **no descriptive help text** — `help` lists `Object.keys(COMMANDS)`, so the command's key *is* its help. Don't restore verbose help without asking.
- **Rooms:** `ROOMS` keyed by id, and **the key IS the display name** — uppercase, single-token, no `name` field. Per-room: `description` (shown on entry, two short sentences, spells the room name in caps as flavour), `adjacent` (neighbour ids, symmetric — list both sides), optional `allowSleep`.
- **Tone:** light and plain. Short establishing line + one plain observational sentence per room. No sci-fi plot, no winking.
- **Terseness / mobile:** The developer — "be very conservative with printing text to the screen; most users are on mobile." Short, mobile-first, no paragraph where a line does.
- **After any `ROOMS` edit:** `node -c game.js`, and check `adjacent` targets exist and are symmetric.
- Product copy in `src/pages/Project20.tsx` / `src/data/projects.ts` ("A Zork-like text adventure") is accurate — leave it.
