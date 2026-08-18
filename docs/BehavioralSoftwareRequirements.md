Wave Function Collapse — GIVEN/WHEN/THEN
Tile set & grid setup

GIVEN a tile set of 9 tiles, each with 4 edge sockets (N/E/S/W) labeled with a compatibility class (a through e), and a per-tile weight
WHEN a new grid of width w and height h is created
THEN every cell is initialized "uncollapsed" with its option set containing all 9 tile indices

GIVEN two tiles A and B and a direction (e.g. B is east of A)
WHEN checking compatibility
THEN they're compatible only if A's east edge label equals B's west edge label

Entropy selection

GIVEN a grid with at least one uncollapsed cell
WHEN picking which cell to collapse next
THEN scan all uncollapsed cells, compute entropy as options.size + tiny random jitter, and select the cell with the lowest value (jitter exists only to break exact ties, not to bias selection)

GIVEN an uncollapsed cell is found with zero remaining options
WHEN entropy selection encounters it
THEN the step immediately returns "contradiction" and propagation halts

GIVEN no uncollapsed cells remain
WHEN entropy selection runs
THEN the step returns "done"

Collapse

GIVEN the lowest-entropy cell has been selected
WHEN it collapses
THEN one tile is chosen from its remaining options via weighted random selection (each option's probability proportional to its weight), its option set is reduced to that single choice, and it's marked collapsed

Propagation (constraint spreading)

GIVEN a cell has just been collapsed or had its options reduced
WHEN propagation runs
THEN a breadth-first search visits each of its 4 grid-neighbors in turn

GIVEN a neighbor cell is already collapsed
WHEN visited during propagation
THEN it's skipped — collapsed cells are never revisited

GIVEN a neighbor cell is still uncollapsed
WHEN visited during propagation
THEN for each of the neighbor's remaining options, keep it only if it's compatible (per the edge-matching rule) with at least one option still remaining in the current cell; discard the rest

GIVEN a neighbor's option set actually shrank as a result of that filtering
WHEN the filtering completes for that neighbor
THEN the neighbor is enqueued so its own neighbors get re-checked in turn (the constraint keeps rippling outward)

GIVEN a neighbor's option set did NOT shrink
WHEN the filtering completes for that neighbor
THEN it is not re-enqueued — propagation along that branch stops there

Loop / rendering

GIVEN the grid is in "running" status
WHEN each animation frame fires
THEN run 1–8 collapse-and-propagate steps (count set by the selected speed) before redrawing the canvas

GIVEN a cell is collapsed
WHEN rendering
THEN draw it as a solid rect in its tile's assigned color

GIVEN a cell is uncollapsed
WHEN rendering
THEN draw it as a translucent overlay whose opacity increases as its option count decreases, and if 3 or fewer options remain, draw a thin strip along the bottom edge previewing each candidate tile's color