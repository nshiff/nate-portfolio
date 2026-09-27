import { test, expect } from '@playwright/test';

const PAGE = '/project/21';

/** The terminal's output log and command input, plus a submit helper. */
function terminal(page: import('@playwright/test').Page) {
  const output = page.getByRole('log', { name: 'Terminal output' });
  const input = page.getByRole('textbox', { name: 'Command' });
  return {
    output,
    input,
    run: async (cmd: string) => {
      await input.fill(cmd);
      await input.press('Enter');
    },
  };
}

test('the session opens with the welcome line, the BEDROOM, and a focused input', async ({ page }) => {
  await page.goto(PAGE);
  const { output, input } = terminal(page);
  await expect(output).toContainText('Welcome! Run HELP to list available commands.');
  await expect(output).toContainText('You find yourself in a tidy BEDROOM.');
  await expect(output).toContainText('Adjacent:');
  await expect(input).toBeFocused();
});

test('a command is echoed, answered, and the input cleared', async ({ page }) => {
  await page.goto(PAGE);
  const { output, input, run } = terminal(page);
  await run('help');
  await expect(output).toContainText('> help');
  await expect(output.locator('div').last()).toHaveText(/^HELP\s+ITEMS\s+WALK$/);
  await expect(input).toHaveValue('');
});

test('an unknown command is reported, not silently eaten', async ({ page }) => {
  await page.goto(PAGE);
  const { output, run } = terminal(page);
  await run('teleport FOREST');
  await expect(output).toContainText('Unknown command: TELEPORT FOREST.');
});

test('blank input prints nothing', async ({ page }) => {
  await page.goto(PAGE);
  const { output, run } = terminal(page);
  await run('   ');
  await expect(output.locator('div')).toHaveCount(1);
});

test('the opening screen hands over the SECRETRECIPE', async ({ page }) => {
  await page.goto(PAGE);
  const { output, run } = terminal(page);
  await expect(output).toContainText('You find a worn index card containing a SECRETRECIPE.');
  await run('items');
  await expect(output.locator('div').last()).toHaveText('SECRETRECIPE');
});

test('walking into a room picks up its item once, and ITEMS remembers it', async ({ page }) => {
  await page.goto(PAGE);
  const { output, run } = terminal(page);
  const last = output.locator('div').last();

  await run('walk BRIDGE');
  await expect(last).toHaveText('Cannot walk to BRIDGE from here.');
  await run('walk corridor');
  await expect(last).toContainText('A narrow CORRIDOR.');
  await expect(last).not.toContainText('You find');
  await run('walk bridge');
  await expect(last).toContainText('You find a folded STARCHART of an uncharted sector.');
  await run('walk corridor');
  await run('walk bridge');
  await expect(last).toContainText('The BRIDGE.');
  await expect(last, 'no second pickup').not.toContainText('You find');
  await run('items');
  await expect(last).toHaveText(/^SECRETRECIPE\s+STARCHART$/);
});

test('the terminal takes on each zone\'s colours as the player crosses into it', async ({ page }) => {
  await page.goto(PAGE);
  const { output, run } = terminal(page);
  const screen = output.locator('..');

  await expect(screen).toHaveCSS('color', 'rgb(255, 255, 255)'); // BEDROOM
  await expect(screen).toHaveCSS('background-color', 'rgb(10, 10, 10)');
  await run('walk CORRIDOR');
  await expect(screen).toHaveCSS('color', 'rgb(51, 255, 102)'); // SHIP
  await expect(screen).toHaveCSS('background-color', 'rgb(10, 10, 10)');
  for (const room of ['ENGINEERING', 'AIRLOCK', 'HANGAR', 'SHUTTLE']) {
    await run(`walk ${room}`);
  }
  await expect(screen).toHaveCSS('background-color', 'rgb(53, 40, 121)'); // SHUTTLE
  await run('walk MARSPORT');
  await expect(screen).toHaveCSS('background-color', 'rgb(92, 10, 10)'); // MARS
  await expect(screen).toHaveCSS('color', 'rgb(255, 244, 236)');
  await run('walk SHUTTLE');
  await run('walk HANGAR');
  await expect(screen).toHaveCSS('background-color', 'rgb(10, 10, 10)'); // back aboard
});

test('arrow keys step through command history', async ({ page }) => {
  await page.goto(PAGE);
  const { input, run } = terminal(page);
  await run('help');
  await run('look');

  await input.press('ArrowUp');
  await expect(input).toHaveValue('look');
  await input.press('ArrowUp');
  await expect(input).toHaveValue('help');
  await input.press('ArrowUp');
  await expect(input, 'stops at the oldest entry').toHaveValue('help');
  await input.press('ArrowDown');
  await expect(input).toHaveValue('look');
  await input.press('ArrowDown');
  await expect(input, 'past the newest entry is a fresh line').toHaveValue('');
});

test('output stays scrolled to the newest line', async ({ page }) => {
  await page.goto(PAGE);
  const { output, run } = terminal(page);
  for (let i = 0; i < 30; i++) {
    await run('help');
  }
  const gap = await output.evaluate((el) => el.scrollHeight - el.scrollTop - el.clientHeight);
  expect(gap).toBeLessThanOrEqual(1);
});

test('tapping the output focuses the input', async ({ page }) => {
  await page.goto(PAGE);
  const { output, input } = terminal(page);
  await input.blur();
  await expect(input).not.toBeFocused();
  await output.click();
  await expect(input).toBeFocused();
});
