import { test, expect } from '@playwright/test';

const GAME = '/demo/zork-roguelike/index.html';

/** Small helper: fill #cmd, submit, and read back the whole #output. */
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

/* ---------- shell basics ---------- */

test('whoami returns "player"', async ({ page }) => {
  await page.goto(GAME);
  const { run, output } = driver(page);
  await run('whoami');
  await expect(output).toContainText('player');
});

test('walk from BEDROOM all the way to OUTLOOK', async ({ page }) => {
  await page.goto(GAME);
  const { run, output } = driver(page);

  // BEDROOM -> LIVINGROOM -> FRONTLAWN -> CITYPARK -> OUTLOOK
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

/* ---------- the henchman case ---------- */

test('help lists the case commands', async ({ page }) => {
  await page.goto(GAME);
  const { run, text } = driver(page);
  await run('help');
  const listed = await text();
  for (const cmd of ['scan', 'take', 'drop', 'inventory', 'talk', 'notes', 'accuse', 'look']) {
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

test('talking to an NPC records a clue in the notebook', async ({ page }) => {
  await page.goto(GAME);
  const { run, text } = driver(page);

  for (const r of ['LIVINGROOM', 'FRONTLAWN', 'DOWNTOWN', 'CAFE']) {
    await run(`walk ${r}`);
  }
  await run('talk');
  expect(await text()).toContain('Mr. Five-by-Five');

  await run('notes');
  const notes = await text();
  expect(notes).toContain('CASE NOTES');
  expect(notes).toContain('six-year tab');
});

test('you cannot accuse without proof, and the correct accusation closes the case', async ({ page }) => {
  await page.goto(GAME);
  const { run, text } = driver(page);

  await run('accuse MOONLET');
  expect(await text()).toContain("haven't established");

  for (const r of ['LIVINGROOM', 'FRONTLAWN', 'CITYPARK', 'FOUNTAIN']) {
    await run(`walk ${r}`);
  }
  await run('take grey coin');
  await run('walk UNDERPASS');
  await run('walk PUMPROOM');
  await run('walk RESERVOIR');
  await run('scan');
  expect(await text()).toContain('DESTINATION: MOONLET');

  await run('accuse PLUTO');
  expect(await text()).toContain('WRONG');

  await run('accuse MOONLET');
  expect(await text()).toContain('CASE CLOSED');
  await expect(page.locator('#cmd')).toBeDisabled();
});
