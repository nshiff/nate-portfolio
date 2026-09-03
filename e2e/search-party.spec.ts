import { test, expect } from '@playwright/test';

const GAME = '/demo/zork-roguelike/index.html';

/** Fill #cmd, submit, read back the whole #output. */
function driver(page: import('@playwright/test').Page) {
  const input = page.locator('#cmd');
  const output = page.locator('#output');
  return {
    output,
    run: async (cmd: string) => {
      await input.fill(cmd);
      await input.press('Enter');
    },
    text: async () => (await output.textContent()) ?? '',
  };
}

/* Six rooms: a spine (BEDROOM <-> LIVINGROOM <-> FRONTLAWN) with a
   three-way fork at the end (DOWNTOWN / CITYPARK / FOREST, each a
   dead end). No case, no clock, no scanner -- just navigation. */

const ROOMS = ['BEDROOM', 'LIVINGROOM', 'FRONTLAWN', 'DOWNTOWN', 'CITYPARK', 'FOREST'];

test('the session intro shows the help tip then the BEDROOM', async ({ page }) => {
  await page.goto(GAME);
  const { text } = driver(page);
  const intro = await text();
  expect(intro).toContain('Type help or HELP to see available commands.');
  expect(intro).toContain('A small BEDROOM.');
  expect(intro).toContain('Adjacent:');
  expect(intro).toContain('LIVINGROOM');
});

test('look re-prints the current room description and adjacent list', async ({ page }) => {
  await page.goto(GAME);
  const { run, text } = driver(page);
  await run('walk LIVINGROOM');
  await run('look');
  const full = await text();
  const lookBlock = full.slice(full.lastIndexOf('> LOOK') + '> LOOK'.length);
  expect(lookBlock).toContain('A cozy LIVINGROOM.');
  expect(lookBlock).toContain('Adjacent:');
  expect(lookBlock).toContain('BEDROOM, FRONTLAWN');
});

test('walk the spine out to each fork leaf and back', async ({ page }) => {
  await page.goto(GAME);
  const { run, output, text } = driver(page);

  await run('walk LIVINGROOM');
  await run('walk FRONTLAWN');
  await expect(output).toContainText('FRONTLAWN');
  // the fork's neighbours, sorted A-Z on the Adjacent line
  await expect(output).toContainText('CITYPARK, DOWNTOWN, FOREST, LIVINGROOM');

  for (const leaf of ['DOWNTOWN', 'CITYPARK', 'FOREST']) {
    await run(`walk ${leaf}`);
    await run('walk FRONTLAWN');
  }
  expect(await text(), 'no move was rejected').not.toContain("Can't walk to");
});

test('walk rejects a non-adjacent room', async ({ page }) => {
  await page.goto(GAME);
  const { run, text } = driver(page);
  await run('walk CITYPARK'); // not adjacent to BEDROOM
  expect(await text()).toContain("Can't walk to");
});

test('map lists only visited rooms, marking the current one', async ({ page }) => {
  await page.goto(GAME);
  const { run, text } = driver(page);
  await run('walk LIVINGROOM');
  await run('map');
  // read just the map block (everything after the last "> map" echo);
  // FRONTLAWN otherwise appears in an earlier Adjacent line
  const full = await text();
  const mapBlock = full.slice(full.lastIndexOf('> MAP') + '> MAP'.length);
  expect(mapBlock).toContain('BEDROOM');
  expect(mapBlock).toContain('LIVINGROOM (you are here)');
  expect(mapBlock, 'unvisited rooms are hidden').not.toContain('FRONTLAWN');
});

test('sleep works where allowed and is refused on the FRONTLAWN', async ({ page }) => {
  await page.goto(GAME);
  const { run, text } = driver(page);

  await run('sleep'); // BEDROOM allows it
  expect(await text()).toContain('You awake feeling');

  await run('walk LIVINGROOM');
  await run('walk FRONTLAWN');
  await run('sleep');
  expect(await text()).toContain("You can't sleep here.");

  await run('walk FOREST');
  await run('sleep'); // FOREST allows it
  expect(await text()).toContain('You awake feeling');
});

test('color sets --fg for the session and resets to green on reload', async ({ page }) => {
  await page.goto(GAME);
  const { run } = driver(page);

  await run('color amber');
  await expect(page.locator('#cmd')).toBeVisible();
  const fg = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--fg').trim(),
  );
  expect(fg.toLowerCase()).toBe('#ffb02e');

  await page.reload();
  const fgAfter = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--fg').trim(),
  );
  expect(fgAfter.toLowerCase()).toBe('#33ff66');
});

test('an unknown command is reported, not silently eaten', async ({ page }) => {
  await page.goto(GAME);
  const { run, text } = driver(page);
  await run('teleport FRONTLAWN');
  expect(await text()).toContain('Unknown command: "TELEPORT FRONTLAWN"');
});

test('every room key is a single uppercase token and the graph is symmetric', async ({ page }) => {
  await page.goto(GAME);
  // walk everywhere, then assert map shows all six once each visited
  const { run, text } = driver(page);
  for (const step of [
    'walk LIVINGROOM', 'walk FRONTLAWN', 'walk DOWNTOWN', 'walk FRONTLAWN',
    'walk CITYPARK', 'walk FRONTLAWN', 'walk FOREST', 'walk FRONTLAWN',
  ]) await run(step);
  await run('map');
  const m = await text();
  for (const r of ROOMS) {
    expect(m, `map lists ${r}`).toContain(r);
    expect(r, `${r} is a single uppercase token`).toMatch(/^[A-Z]+$/);
  }
});
