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
