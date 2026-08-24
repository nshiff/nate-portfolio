# Claude's Corner

This file is maintained by Claude, for Claude. It is versioned with the rest of the codebase (unlike `MEMORY.md`, which is local and ephemeral), so notes here persist across machines and are visible in diffs/PR history to the user.

Use it for durable, codebase-specific knowledge that helps future sessions work in this repo faster: non-obvious conventions, gotchas, structural notes, or context that isn't already obvious from reading the code. Keep entries concise and dated when relevant. Prune entries that go stale rather than letting them accumulate indefinitely.

No permission is needed to edit this file — update it freely as you learn things worth carrying forward.

## Notes

### 2026-08-17 — First look: layout and architecture

Initial orientation pass after this file was created. Reading the code fresh, here's what stood out.

**Shape of the app.** It's a client-only React 19 + TypeScript SPA (Vite, react-router v8's data router), no backend. `src/App.tsx` defines one shared `Layout` (header/nav/footer) wrapping a `Home` route plus one route per project (`/project/01`, `/project/02`, ...). There's no dynamic `/project/:id` route — every project gets its own explicit route entry and its own page component in `src/pages/`. Adding a project means touching three places: `src/data/projects.ts`, a new `src/pages/ProjectNN.tsx`, and a new route + import in `App.tsx`.

**Source of truth.** `src/data/projects.ts` is a flat array of `Project` objects (id, title, description, emoji, gradient background, category). `Home.tsx` reads this to render category sections and a featured strip; nothing else needs to know about a project until you click into it. IDs are zero-padded two-digit strings and are *not* contiguous/ordered in the array — they're grouped by category instead, so don't assume array order matches numeric ID order. Also: id `17` is currently missing (skips 16 → 18) — worth checking `git log` if that ever seems surprising rather than assuming it's a bug.

**Two ways a demo gets embedded**, and this is the main architectural fork worth remembering:
1. **Sandboxed iframe** (most demos): the page component (e.g. `Project01.tsx`) renders an `<iframe src="/demo/whatever.html">` pointing at a fully self-contained static HTML file in `public/demo/`. These are standalone — their own script tags, no build step, no access to the app's React tree. This is clearly the default/preferred pattern (15 of the demos work this way).
2. **Inline React component**: a few demos (`ModularSynth`, `DoubleSlitVisualization`, `NavigatorDashboard`) are `.jsx` files living in `src/components/`, imported and rendered directly into the page component's tree. Notably these are `.jsx` with a hand-written sibling `.d.ts` for typing — not `.tsx` — in an otherwise all-TypeScript codebase. That's a deliberate-looking inconsistency, not an oversight; likely because they were dropped in from AI-generated canvases (Gemini Canvas / Claude) with minimal porting.

**Provenance is part of the product.** The README and several project pages explicitly credit AI tools (Gemini Canvas, Claude) as co-authors of individual demos, with source-code links back to the `public/demo/*.html` files on GitHub. This is a portfolio meant to showcase AI-assisted build velocity, not just the demos themselves — worth keeping in mind when deciding how much to polish vs. preserve the "as generated" character of a piece.

**Styling** is mostly inline `style={{}}` objects using CSS custom properties (`var(--text-secondary)`, `var(--accent-color)`, `var(--border-color)`) defined presumably in `src/index.css`/theme provider, plus Tailwind is a dependency but I haven't yet confirmed how much it's actually used vs. the inline-style/CSS-vars approach — worth checking before assuming Tailwind utility classes are idiomatic here.

**Open questions for later sessions:** whether the `.jsx`+`.d.ts` pattern for inline components should be migrated to `.tsx` if touched again.

### 2026-08-17 — Answers from Nate: id 17 and Tailwind

Nate cleared up both open questions from the entry above.

- **Project 17 was Cloth Simulation**, and it's gone deliberately — not a bug, not an accident of the array grouping. It was causing a Vite dev-server warning; Nate tried refactoring it to suppress the warning but the fix didn't work, so he removed it rather than ship the warning. Matches `git log` (`ed70512 chore: remove demo causing warnings in Vite dev server`). Don't reintroduce id `17` casually — if a cloth-sim demo comes back, treat the Vite warning as the thing to solve first, not an afterthought.
- **Tailwind is intentionally a one-off exception**, not a second styling system to build on. It's only there because Gemini used it to build the WebModular synth (`ModularSynth.jsx`) and that demo was cool enough to keep as-is. Nate's preference is **vanilla CSS** (inline `style={{}}` + CSS custom properties, per the pattern noted above) for everything else. Default to that — don't reach for Tailwind classes on new pages/components just because the dependency is present.

### 2026-08-17 — Added project 19: Wave Function Collapse

Built from a GIVEN/WHEN/THEN spec in `docs/BehavioralSoftwareRequirements.md` (now implemented — that file can probably be archived/removed next time someone's in here, since its content is now `public/demo/wave-function-collapse.html`). Followed the standard sandboxed-iframe pattern exactly: `public/demo/wave-function-collapse.html` (self-contained canvas + vanilla JS, styled to match `space-filling.html`'s dark panel/JetBrains-Mono aesthetic), `src/pages/Project19.tsx`, a `projects.ts` entry, an `App.tsx` route, and a `.viz-container-19` height rule in `index.css`.

**Worth knowing if this file gets revisited:** the spec's compatibility rule is strict, non-rotational edge-label matching (tile A's east label must equal tile B's west label, full stop — no "try B rotated 90°"). With a 9-tile terrain set (sea→coast→sand→grass→forest→hill→peak chain) and only one fixed orientation per tile, propagation can't turn corners — it settles into either one flood-filled terrain (if a tile's edges are entirely self-compatible) or straight horizontal/vertical bands (once transition tiles are added), never organic 2D blobs/islands. Verified this in a live browser run (via Playwright, no `chromium-cli` in this environment) — algorithm converges cleanly with zero console errors, it's just visually stripe-y rather than blob-y. Asked Nate whether to add rotated tile variants (would allow corners/islands) or ship as spec'd; **he chose ship-as-spec'd** — the literal GIVEN/WHEN/THEN behavior is what matters here, not maximizing visual variety. Don't "fix" the banding later without checking that preference still holds.

### 2026-08-20 — Playwright installed for real; use it, don't reinvent it

`@playwright/test` is now a proper devDependency (not just a manifest entry — Chromium is downloaded to `~/.cache/ms-playwright`, verified with a live `chromium.launch()` call). There's a `playwright.config.ts` at the repo root that auto-starts `npm run dev` and points `baseURL` at `http://localhost:5173`, plus a first spec at `e2e/home.spec.ts`. Run it with `npm run test:e2e`.

**Before this existed**, verifying a UI change meant hand-rolling a driver against a global `npx playwright`/`chromium-cli` install, which had real friction: no `chromium-cli` in this environment, and a Playwright script run from `/tmp` or a scratchpad directory fails with `ERR_MODULE_NOT_FOUND` because module resolution needs `node_modules` — the script has to live inside the repo tree (an `e2e/*.spec.ts` file via `playwright test`, or a throwaway script under the repo root) to resolve `@playwright/test`. Don't repeat that path — the config + `test:e2e` script already handle server lifecycle.

If a new project page or demo needs visual verification, prefer adding a proper spec under `e2e/` over a one-off screenshot script — `home.spec.ts` is the pattern to extend (navigate, assert visible text/roles). Keep new specs low-effort/smoke-level unless asked for more.

### 2026-08-20 — Aborted Project20 (Boids) attempt; id 20 is free

Built a full Boids flocking simulation (separation/alignment/cohesion steering, click-to-place predator boids flee) following the exact Project19 pattern — `public/demo/boids.html`, `Project20.tsx`, `projects.ts` entry, `App.tsx` route, `.viz-container-20` CSS. Visually verified working (flocks converged into clusters, predator interaction worked, zero console errors) before Nate changed direction mid-session to focus on tooling (Playwright) instead.

**Current state: fully reverted.** Nate deleted `Project20.tsx` and `boids.html` himself but left the `App.tsx`/`projects.ts`/`index.css` wiring in place, which broke the dev server (500 — unresolvable import) until those three files were reverted with `git checkout --`. As of this note, id `20` has zero references anywhere in the codebase — it's genuinely free, not a landmine.

**If Boids gets picked up again:** the approach worked well and matched the portfolio's visual conventions (dark panel `#0F1115`/`#15181E`, JetBrains Mono controls, same `.wrap`/`.controls`/`.stage` structure as `wave-function-collapse.html`) — worth reusing as a starting point rather than redesigning from scratch. Category `Science`, 🐦 emoji were the choices made (unconfirmed with Nate, since the attempt was abandoned before final review — treat as a suggestion, not a settled decision).

### 2026-08-24 — Project20 scaffolded as an explicit placeholder

Nate asked for a placeholder scaffold for the *soon-to-be-added* Project20, not the real Boids simulation. Built the full standard wiring (`public/demo/boids.html`, `src/pages/Project20.tsx`, `projects.ts` entry, `App.tsx` route, `.viz-container-20` in `index.css`) but kept the demo content itself to a "COMING SOON" panel rather than reusing the reverted Boids implementation from 2026-08-20's note above — the two entries are describing different things (a built-then-reverted demo vs. a deliberately-stubbed one), so read both if this project comes up again. Reused the same category (`Science`) and emoji (🐦) as the earlier suggestion since Nate hadn't objected to those specifics, just to the demo being built out fully at that time.

Verified via a throwaway `e2e/*.spec.ts` (written, run with `npx playwright test`, then deleted per the "keep new specs low-effort" guidance — this wasn't meant to be a permanent spec): Home shows the new card, `/project/20` renders, the iframe loads and shows the placeholder text, zero console errors. `tsc --noEmit` also clean.

**If/when the real Boids demo gets built:** just replace `public/demo/boids.html`'s content — everything else (route, data entry, CSS) is already correct and shouldn't need to change unless the visual sizing needs differ from the current `60vh`/`500px` placeholder values.

**2026-08-24, later same day — genericized, Boids content fully stripped.** Nate wanted a clean slate before installing whatever comes next, not a Boids-flavored placeholder. Renamed `public/demo/boids.html` → `public/demo/project20-placeholder.html` (generic "This is a placeholder" / "Demo coming soon" copy), retitled the page component to plain "Project 20", and changed the `projects.ts` entry to title `Coming Soon`, emoji 🚧, category `Miscellaneous` (was `Science` — that was a Boids-specific classification, doesn't fit an unknown future project). **The Boids build notes above (2026-08-20) are now purely historical.**

**2026-08-24, third pass — Project20 is now Zork Roguelike.** Nate pointed the iframe at `public/demo/zork-roguelike/index.html` (a pre-existing untracked directory with `index.html` + `game.js` that predates this session — I didn't build it, just wired it up). Deleted the now-orphaned `project20-placeholder.html` per Nate's call.

**2026-08-24, fourth pass — user-facing text reconciled (to LOWTOWN, now superseded — see next entry).** Read `game.js` to confirm what the demo actually was at the time: **LOWTOWN**, a Zork-style parser text adventure with a procedurally generated cyberpunk city. Updated page copy to match. This description is now stale — see below.

**2026-08-24, fifth pass — renamed to "Search Party," and the demo file itself was reset to a bare stub.** Nate renamed the project again and started over: `public/demo/zork-roguelike/index.html` and `game.js` are now a minimal ~10-line placeholder ("hello, Search Party" + a debug dashed-red border on `<body>`), not the fleshed-out LOWTOWN game described in the pass above — that implementation is gone from the working tree. Updated `Project20.tsx` and the `projects.ts` entry to title "Search Party," tagged "Zork-like," with deliberately minimal description ("A Zork-like text adventure, currently in early development.") rather than reusing LOWTOWN's specific-mechanics copy, since none of those mechanics exist in the current file. **Don't assume the directory name `zork-roguelike/` still reflects the game's identity or mechanics** — it's now just a stale folder name from an earlier iteration; treat `game.js`'s actual current content as ground truth each time this page is touched, not this note's history.

### 2026-08-24, sixth pass — REPL shell built for Search Party

Implemented the actual REPL UI inside `public/demo/zork-roguelike/` (still the same directory, name now stale — see above): dark terminal (`#0a0a0a` bg), monospace (`JetBrains Mono` w/ `Courier New` fallback), a single `<input>` line at the bottom, output scrollback above it, and three circular color-swatch buttons top-right (green/amber/white) that set a `--fg` CSS custom property and persist the choice to `localStorage` (`searchparty-color` key, wrapped in try/catch since this is an iframed demo). Built-ins: `whoami` → `"player"`, `help` → lists all registered commands from a single `COMMANDS` object (adding a new command later just means adding an entry there — `help` text stays in sync automatically), `exit` → prints "Simulation ended." and disables the input. Unknown input prints a "Unknown command" hint pointing at `help`. No animations/visual flourishes per Nate's explicit ask — this is deliberately plain.

Verified interactively with a throwaway Playwright spec (typed each command, asserted output text, checked the `--fg` CSS var after clicking amber, confirmed `exit` disables `#cmd`, zero console errors) plus a manual screenshot to eyeball the rendering — both deleted after, per the existing "scratch spec, run, delete" pattern in this file.

**If more commands get added later:** follow the `COMMANDS` object pattern (`{ help: "...", run: () => "..." }`) rather than a big if/else chain — `help` and the dispatcher both already iterate it generically, so a new entry is the only change needed. The Project20 page copy ("early development") is still accurate and doesn't need updating for this pass.

**2026-08-24, seventh pass — output/input text made bigger and bold.** `#output`, `#cmd`, and `#prompt` bumped from `0.9375rem`/regular to `1.125rem`/bold in `index.html`'s `<style>`. Deliberately left `#titlebar .title` ("SEARCH PARTY") at its original small size — that's chrome, not game text, and wasn't part of the ask. Note `#prompt` needed an explicit override too, not just `#output`/`#cmd` — it inherits from `body`, not from either of those, so it would've stayed thin/small otherwise and looked inconsistent next to the now-bold input.

**2026-08-24, eighth pass — `help` now mentions the color swatches.** Nate wanted the corner color-picker discoverable, not just tucked away silently. Since the swatches are mouse-driven UI, not a typed command, they don't belong in the `COMMANDS` object — instead `help`'s `run()` appends a plain tip line after the auto-generated command list ("Tip: click a color swatch in the top-right corner..."). If a `color <name>` command ever gets added as a keyboard-driven alternative, fold it into `COMMANDS` properly at that point and this tip line can probably go — right now it's the only way `help` surfaces the feature.

**Nate committed and pushed after the "bold text" pass (seventh above)** — so as of that point this demo is live on the deployed branch, not just local working-tree state. Worth keeping in mind: future changes here are shipping to a real audience, not just sitting in an uncommitted iteration.
