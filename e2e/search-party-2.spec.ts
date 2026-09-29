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
  // The text itself is uppercase (not just CSS), so copying it gives what is shown.
  await expect(output).toContainText('> HELP');
  await expect(output.locator('div').last()).toHaveText(/^ABOUT\s+HELP\s+ITEMS\s+WALK$/);
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

test('ITEMS starts empty', async ({ page }) => {
  await page.goto(PAGE);
  const { output, run } = terminal(page);
  await run('items');
  await expect(output.locator('div').last()).toHaveText('No items found.');
});

test('walking into a room picks up its item once, and ITEMS remembers it', async ({ page }) => {
  await page.goto(PAGE);
  const { output, run } = terminal(page);
  const last = output.locator('div').last();

  await run('walk livingroom');
  await run('walk hallway');
  await expect(last).not.toContainText('You find');
  await run('walk galley');
  await expect(last).toContainText('You find a worn index card containing a SECRETRECIPE.');
  await run('walk hallway');
  await run('walk galley');
  await expect(last).toContainText('A compact GALLEY.');
  await expect(last, 'no second pickup').not.toContainText('You find');
  await run('items');
  await expect(last).toHaveText('SECRETRECIPE');
});

test('walking moves between adjacent rooms, and refuses the rest', async ({ page }) => {
  await page.goto(PAGE);
  const { output, run } = terminal(page);
  const last = output.locator('div').last();

  await run('walk CORRIDOR');
  await expect(last).toHaveText('Cannot walk to CORRIDOR from here.');
  await run('walk livingroom');
  await expect(last).toContainText('A geometric rug adorns the LIVINGROOM.');
  await run('walk bedroom');
  await expect(last).toContainText('You find yourself in a tidy BEDROOM.');
});

test('the WEIRDPORTAL leads from the HANGAR to the SPACEDECK', async ({ page }) => {
  await page.goto(PAGE);
  const { output, run } = terminal(page);
  const last = output.locator('div').last();

  for (const room of ['LIVINGROOM', 'HALLWAY', 'HANGAR', 'WEIRDPORTAL']) {
    await run(`walk ${room}`);
  }
  await expect(last).toContainText('You just walked into a WEIRDPORTAL. Better not dilly dally, I suppose.');
  await expect(last).toContainText('You find a SHINYCOIN. Your lucky day!');
  await run('walk spacedeck');
  await expect(last).toContainText('A chilly SPACEDECK.');
});

test('the terminal takes on each zone\'s colours as the player crosses into it', async ({ page }) => {
  await page.goto(PAGE);
  const { output, run } = terminal(page);
  const screen = output.locator('..');

  await expect(screen).toHaveCSS('color', 'rgb(51, 255, 102)'); // QUARTERS
  await expect(screen).toHaveCSS('background-color', 'rgb(10, 10, 10)');
  await run('walk LIVINGROOM');
  await expect(screen).toHaveCSS('color', 'rgb(51, 255, 102)'); // still QUARTERS
  await run('walk HALLWAY');
  await expect(screen).toHaveCSS('color', 'rgb(255, 255, 255)'); // HOMEBASE
  await run('walk HANGAR');
  await run('walk WEIRDPORTAL');
  await expect(screen).toHaveCSS('background-color', 'rgb(53, 40, 121)'); // WEIRDPORTAL
  await expect(screen).toHaveCSS('color', 'rgb(212, 208, 255)');
  await run('walk SPACEDECK');
  await expect(screen).toHaveCSS('background-color', 'rgb(11, 34, 51)'); // EUROPA
  await expect(screen).toHaveCSS('color', 'rgb(191, 244, 255)');
  await run('walk WEIRDPORTAL');
  await run('walk HANGAR');
  await expect(screen).toHaveCSS('color', 'rgb(255, 255, 255)'); // back aboard
  await run('walk HALLWAY');
  await run('walk LIVINGROOM');
  await expect(screen).toHaveCSS('color', 'rgb(51, 255, 102)'); // back in QUARTERS
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
