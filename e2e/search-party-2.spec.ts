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
  await expect(input).toBeFocused();
});

test('a command is echoed, answered, and the input cleared', async ({ page }) => {
  await page.goto(PAGE);
  const { output, input, run } = terminal(page);
  await run('help');
  await expect(output).toContainText('> help');
  await expect(output.locator('div').last()).toHaveText(/^HELP\s+ITEMS\s+SEEK$/);
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

test('an item found with SEEK stays found across commands', async ({ page }) => {
  await page.goto(PAGE);
  const { output, run } = terminal(page);
  const last = output.locator('div').last();

  await run('items');
  await expect(last).toHaveText('No items found.');
  await run('seek');
  await expect(last).toHaveText('You found a worn index card containing a SECRETRECIPE.');
  await run('seek');
  await expect(last).toHaveText('Nothing else to find here.');
  await run('items');
  await expect(last).toHaveText('SECRETRECIPE');
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
