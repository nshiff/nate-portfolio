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

/* ---------- shell basics (deterministic) ---------- */

test('whoami returns "player"', async ({ page }) => {
  await page.goto(GAME);
  const { run, output } = driver(page);
  await run('whoami');
  await expect(output).toContainText('player');
});

test('walk from BEDROOM all the way to OUTLOOK', async ({ page }) => {
  await page.goto(GAME);
  const { run, output } = driver(page);
  for (const room of ['LIVINGROOM', 'FRONTLAWN', 'CITYPARK', 'OUTLOOK']) {
    await run(`walk ${room}`);
  }
  await expect(output).toContainText('From the OUTLOOK you can see');
  await expect(output).not.toContainText("Can't walk to");
});

test('sleep works in LIVINGROOM but not on FRONTLAWN', async ({ page }) => {
  await page.goto(GAME);
  const { run, output } = driver(page);
  await run('walk LIVINGROOM');
  await run('sleep');
  await expect(output).toContainText('You awake feeling');
  await run('walk FRONTLAWN');
  await run('sleep');
  await expect(output).toContainText("You can't sleep here.");
});

test('help lists the case commands', async ({ page }) => {
  await page.goto(GAME);
  const { run, text } = driver(page);
  await run('help');
  const listed = await text();
  for (const cmd of ['scan', 'take', 'drop', 'inventory', 'talk', 'notes', 'accuse', 'case', 'suspects', 'look']) {
    expect(listed, `help should list "${cmd}"`).toContain(cmd);
  }
});

test('you start holding the scanner and scan reads the room', async ({ page }) => {
  await page.goto(GAME);
  const { run, text } = driver(page);
  await run('inventory');
  expect(await text()).toContain('pocket scanner');
  await run('scan');
  expect(await text()).toContain('AMBIENT WEIRDNESS');
});

test('PUMPROOM is gated until you carry the grey coin', async ({ page }) => {
  await page.goto(GAME);
  const { run, text } = driver(page);
  for (const r of ['LIVINGROOM', 'FRONTLAWN', 'CITYPARK', 'FOUNTAIN', 'UNDERPASS']) {
    await run(`walk ${r}`);
  }
  await run('walk PUMPROOM');
  expect(await text()).toContain('blocked');

  await run('walk FOUNTAIN');
  await run('take grey coin');
  expect(await text()).toContain('Taken: grey coin');

  await run('walk UNDERPASS');
  await run('walk PUMPROOM');
  expect(await text()).toContain('CLUNK');
});

/* ---------- the randomised case ---------- */

test('case brief and suspects board render', async ({ page }) => {
  await page.goto(GAME);
  const { run, text } = driver(page);

  await run('case');
  const brief = await text();
  expect(brief).toContain('CASE BRIEF');
  expect(brief).toContain('accuse <NAME> to <PLACE>');

  await run('suspects');
  const board = await text();
  expect(board).toContain('SUSPECTS:');
  // all six suspects are always on the board
  for (const name of [
    'MR. FIVE-BY-FIVE', 'THE LAMPLIGHTER', 'AUNT PERPETUA',
    'THE COMMODORE', 'LITTLE STANLEY', 'PROF. HALLOWAY',
  ]) {
    expect(board).toContain(name);
  }
});

test('the case is randomised: scanning the CITYPARK names one of the five landmarks', async ({ page }) => {
  await page.goto(GAME);
  const { run, text } = driver(page);
  for (const r of ['LIVINGROOM', 'FRONTLAWN', 'CITYPARK']) await run(`walk ${r}`);
  await run('scan');
  const t = await text();
  const landmarks = [
    'THE OBELISK', 'THE BIG FERRIS WHEEL', 'THE FOUNDERS\' FOUNTAIN',
    'THE LIBRARY LIONS', 'THE OLD OAK',
  ];
  expect(landmarks.some((l) => t.includes(l)), 'CITYPARK scan names a landmark').toBe(true);
});

test('cannot accuse before the RESERVOIR slip is read', async ({ page }) => {
  await page.goto(GAME);
  const { run, text } = driver(page);
  await run('accuse MR. FIVE-BY-FIVE to MOONLET');
  expect(await text()).toContain("don't know where it went");
});

/**
 * A full investigation against a *randomised* case: gather the tells + read
 * the departure slip, then read the rolled culprit and destination back out
 * of the game's own `suspects` / `notes` output and accuse them. Proves the
 * generator, the deduction board, and the win path end to end without
 * hardcoding the answer.
 */
const SUSPECT_NAMES = [
  'MR. FIVE-BY-FIVE', 'THE LAMPLIGHTER', 'AUNT PERPETUA',
  'THE COMMODORE', 'LITTLE STANLEY', 'PROF. HALLOWAY',
];

const FULL_ROUTE = [
  'walk LIVINGROOM', 'walk FRONTLAWN', 'walk DOWNTOWN',
  'walk CAFE', 'talk', 'walk DOWNTOWN', 'walk STREETFAIR', 'talk',
  'walk FUNHOUSE', 'scan', 'walk STREETFAIR',
  'walk BACKLOT', 'scan', 'walk STREETFAIR',
  'walk DOWNTOWN', 'walk FRONTLAWN', 'walk FOREST',
  'walk TREEHOUSE', 'talk', 'walk FOREST',
  'walk FRONTLAWN', 'walk CITYPARK', 'scan',
  'walk FOUNTAIN', 'take grey coin', 'walk UNDERPASS',
  'walk PUMPROOM', 'walk RESERVOIR', 'scan',
];

async function solveOnce(page: import('@playwright/test').Page) {
  const { run, text } = driver(page);
  for (const step of FULL_ROUTE) await run(step);

  await run('notes');
  const notes = await text();
  const dest = notes.match(/destination ([A-Z0-9'. -]+?) —/)?.[1].trim();
  expect(dest, 'dest clue present in notes').toBeTruthy();

  await run('suspects');
  const board = await text();
  // after a full investigation the board resolves to exactly one fitting suspect
  expect(board, 'board narrows to one suspect').toContain('Only one suspect fits:');
  const live = SUSPECT_NAMES.filter((n) => board.includes(`• ${n} (`));
  expect(live.length, 'exactly one live suspect after full investigation').toBe(1);

  await run(`accuse ${live[0]} to ${dest}`);
  return (await text()).includes('CASE CLOSED');
}

test('a complete investigation closes the randomised case', async ({ page }) => {
  await page.goto(GAME);
  expect(await solveOnce(page)).toBe(true);
  await expect(page.locator('#cmd')).toBeDisabled();
});

test('ten fresh rolls are each solvable', async ({ page }) => {
  for (let i = 0; i < 10; i++) {
    await page.goto(GAME); // fresh roll per load
    expect(await solveOnce(page), `roll ${i} solvable`).toBe(true);
  }
});

test('wrong accusations cool the trail; a cold case is still winnable', async ({ page }) => {
  await page.goto(GAME);
  const { run, text } = driver(page);

  // gather the three tells (fair + cafe), then the destination
  for (const s of [
    'walk LIVINGROOM', 'walk FRONTLAWN', 'walk DOWNTOWN', 'walk CAFE', 'talk',
    'walk DOWNTOWN', 'walk STREETFAIR', 'walk FUNHOUSE', 'scan', 'walk STREETFAIR',
    'walk BACKLOT', 'scan', 'walk STREETFAIR', 'walk DOWNTOWN', 'walk FRONTLAWN',
    'walk CITYPARK', 'scan', 'walk FOUNTAIN', 'take grey coin', 'walk UNDERPASS',
    'walk PUMPROOM', 'walk RESERVOIR', 'scan',
  ]) await run(s);

  await run('notes');
  const dest = (await text()).match(/destination ([A-Z0-9'. -]+?) —/)![1].trim();

  // fire wrong accusations until the trail is visibly cold
  for (let i = 0; i < 5; i++) await run('accuse THE COMMODORE to THE DARK SIDE');
  const cooled = await text();
  expect(cooled).toMatch(/heat: cold/);

  // the watcher gives nothing now
  for (const s of ['walk PUMPROOM', 'walk UNDERPASS', 'walk FOUNTAIN', 'walk CITYPARK', 'walk FRONTLAWN', 'walk FOREST', 'walk TREEHOUSE', 'talk']) {
    await run(s);
  }
  expect(await text()).toContain('nothing for the late ones');

  // still winnable: the board already narrows to one suspect from the tells
  await run('suspects');
  const board = await text();
  expect(board).toContain('Only one suspect fits:');
  const live = SUSPECT_NAMES.filter((n) => board.includes(`• ${n} (`));
  expect(live.length).toBe(1);

  await run(`accuse ${live[0]} to ${dest}`);
  expect(await text()).toContain('CASE CLOSED');
});
