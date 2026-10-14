import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`layout and locally served assets at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('./');
    await page.waitForTimeout(1700);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBeTruthy();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(
      page.getByRole('button', { name: 'Ask AI', exact: true }),
    ).toBeVisible();
    for (const img of await page.locator('img').all()) {
      const src = await img.getAttribute('src');
      if (src) expect((await page.request.get(src)).ok(), src).toBeTruthy();
    }
    expect(errors).toEqual([]);
  });
}

test('Ask AI copies the complete edited prompt and restores focus', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('./');
  const trigger = page.getByRole('button', { name: 'Ask AI', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog
    .getByLabel('Your question')
    .fill('Does CodeHub support private repositories?');
  await dialog
    .getByRole('button', { name: 'Copy prompt', exact: true })
    .click();
  await expect(dialog.getByRole('status')).toContainText('Full prompt copied');
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('Does CodeHub support private repositories?');
  expect(copied).toContain(
    'https://rishijain07.github.io/codehub-extension/llms.txt',
  );
  for (const provider of [
    'Gemini',
    'Perplexity',
    'Grok',
    'ChatGPT',
    'Claude',
  ]) {
    await expect(
      dialog.getByRole('link', { name: provider, exact: true }),
    ).toHaveAttribute('target', '_blank');
  }
  await expect
    .poll(() =>
      dialog
        .locator('img')
        .evaluateAll((images) =>
          images.every(
            (image) =>
              (image as HTMLImageElement).complete &&
              (image as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBeTruthy();
  await dialog.getByLabel('Your question').fill('');
  await expect(
    dialog.getByRole('button', { name: 'Copied', exact: true }),
  ).toHaveCount(0);
  await expect(
    dialog.getByRole('button', { name: 'Copy prompt', exact: true }),
  ).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('platform selection and FAQ disclosures work with keyboard input', async ({
  page,
}) => {
  await page.goto('./');
  const platform = page.getByRole('radio', { name: 'Codeforces', exact: true });
  await platform.scrollIntoViewIfNeeded();
  await platform.focus();
  await page.keyboard.press('Space');
  await expect(page.locator('.platform-detail')).toContainText(
    'Background sync',
  );
  await expect(page.locator('.platform-detail')).toContainText('codeforces/');
  const question = page.getByRole('button', {
    name: 'Does CodeHub work with private GitHub repositories?',
  });
  await question.scrollIntoViewIfNeeded();
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(
    page.locator('[data-slot="accordion-content"][data-state="open"]'),
  ).toContainText('revoke access');
});

test('reduced motion disables pinning and leaves all content readable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  expect(
    await page
      .locator('.journey-track')
      .evaluate((el) => getComputedStyle(el).flexDirection),
  ).toBe('column');
  for (const title of ['Connect once.', 'Make it yours.', 'Keep solving.']) {
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  }
});

test('desktop motion pins the narrative and the pause control removes pinning', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./');
  await expect(page.locator('.pin-spacer')).toHaveCount(1);
  await page.evaluate(() =>
    window.scrollTo({
      top:
        (document.querySelector('.pin-spacer') as HTMLElement).offsetTop +
        innerWidth,
      behavior: 'instant',
    }),
  );
  await expect
    .poll(() =>
      page
        .locator('.journey-track')
        .evaluate((element) => element.getBoundingClientRect().left),
    )
    .toBeLessThan(-1000);
  await page.getByRole('button', { name: 'Pause motion' }).click();
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Resume motion' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
});

for (const colorScheme of ['light', 'dark'] as const) {
  test(`WCAG checks for page and dialog in ${colorScheme} mode`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
    await page.goto('./');
    await page.locator('#faq').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations).toEqual([]);
    await page.getByRole('button', { name: 'Ask AI', exact: true }).click();
    const dialog = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(dialog.violations).toEqual([]);
  });
}

test('static HTML contains SEO metadata, platform names, FAQ answers, and public documents', async ({
  request,
}) => {
  const response = await request.get('./');
  const html = await response.text();
  expect(html).toContain(
    'rel="canonical" href="https://rishijain07.github.io/codehub-extension/"',
  );
  expect(html).toContain('application/ld+json');
  expect(html).toContain('SoftwareApplication');
  expect(html).toContain('fIn7rdm0KMBVbsFaKfNsXn-Lv02S1xSV8qaXEUE-XME');
  expect(html).toContain('revoke access in your GitHub settings');
  for (const name of [
    'LeetCode',
    'GeeksforGeeks',
    'Codeforces',
    'CodeChef',
    'NeetCode',
    'HackerRank',
    'Code360',
  ])
    expect(html).toContain(name);
  for (const path of [
    'sitemap.xml',
    'robots.txt',
    'llms.txt',
    'privacypolicy.txt',
  ])
    expect((await request.get(path)).ok()).toBeTruthy();
  expect(await (await request.get('sitemap.xml')).text()).toContain(
    '<loc>https://rishijain07.github.io/codehub-extension/</loc>',
  );
});

test('clipboard denial offers a complete manual-copy prompt', async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async () => {
          throw new Error('Clipboard denied');
        },
      },
    }),
  );
  await page.goto('./');
  await page.getByRole('button', { name: 'Ask AI', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog
    .getByRole('button', { name: 'Copy prompt', exact: true })
    .click();
  await expect(dialog.getByRole('status')).toContainText(
    'Clipboard access is unavailable',
  );
  await dialog.getByText('View the full prompt').click();
  await expect(dialog.getByLabel('Full prompt for manual copying')).toHaveValue(
    /Documentation: https:\/\/rishijain07.github.io\/codehub-extension\/llms.txt/,
  );
});

test('core content and native FAQ work without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/codehub-extension/');
  await expect(page.locator('h1')).toBeVisible();
  expect(
    await page
      .locator('.journey-track')
      .evaluate((el) => getComputedStyle(el).flexDirection),
  ).toBe('column');
  const item = page
    .locator('.native-faq details')
    .filter({ hasText: 'Does CodeHub work with private GitHub repositories?' });
  await item.locator('summary').click();
  await expect(item.locator('p')).toBeVisible();
  await context.close();
});
