import { expect, test } from '@playwright/test';

test('click trial', async ({ page }) => {
  await page.setContent(`<button onclick="this.innerText = 'updated'">initial</button>`);
  const locator = page.locator('button');

  await locator.click({ trial: true });
  await expect(locator).toHaveText('initial');

  await locator.click();
  await expect(locator).toHaveText('updated');

  // works as expected
});

test('click trial with modifiers', async ({ page }) => {
  await page.setContent(`<button onclick="this.innerText = 'clicked'">initial</button>`);
  const locator = page.locator('button');

  await page.evaluate(() => {
    document.body.addEventListener('keydown', (event: KeyboardEvent) => {
      document.querySelector('button')!.innerText = 'keydown:' + event.key;
    });
  });

  await locator.click({ trial: true, modifiers: ['Shift'] });
  await expect(locator).toHaveText('initial'); // fails as modifier key is pressed

  await locator.click({ modifiers: ['Shift'] });
  await expect(locator).toHaveText('clicked');
});

test('hover trial', async ({ page }) => {
  const locator = page.locator('button');

  await page.setContent(`<button onmouseover="this.innerText = 'mouseover'">initial</button>`);
  await locator.hover({ trial: true });
  await expect(locator).toHaveText('initial'); // fails as mouseover event is received

  await locator.hover();
  await expect(locator).toHaveText('mouseover');
});
