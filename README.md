# nate-portfolio

Live demo: https://nate-portfolio.onrender.com/

Portfolio site built with Google Antigravity and Claude Code. Demos largely built with AI assistance (Gemini Canvas, Claude).

```
# running locally
npm install
npm run dev
```

As of this writing, there are over a dozen browser-based demos across topics in science, math, and technology. Featured mini-apps include a double slit experiment simulation, a 3D Platonic solids viewer, and a TI-83-themed fortune teller program.

## Data Flow and Architecture (AI-authored overview)

This is a single-page web app that renders entirely in the browser with no backend, and its data flow is short. A single project catalog file lists every demo along with its title, description, and category; that catalog is the source of truth for the landing page, which groups the entries into sections and renders each one as a card. Selecting a card navigates to that demo's own detail page, which frames the demo alongside a short description. The path, in other words, runs from catalog to landing cards to a routed detail page to the demo itself. Each demo is embedded in one of two ways: most are self-contained HTML pages loaded in a sandboxed frame, while a few are built directly into the app.
