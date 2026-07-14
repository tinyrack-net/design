import { readFile, stat } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join, resolve, sep } from 'node:path';
import { type Browser, chromium, type Locator, type Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { staticDocumentRoutes } from '../app/content/shared/static-document-routes.js';

const buildRoot = join(process.cwd(), 'build/client');

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

async function staticPath(requestUrl: string) {
  const pathname = decodeURIComponent(
    new URL(requestUrl, 'http://homepage.local').pathname,
  ).replaceAll('\\', '/');
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const baseCandidate = resolve(buildRoot, relative);
  const rootPrefix = `${resolve(buildRoot)}${sep}`;
  if (baseCandidate !== resolve(buildRoot) && !baseCandidate.startsWith(rootPrefix)) {
    return undefined;
  }

  for (const candidate of [
    baseCandidate,
    join(baseCandidate, 'index.html'),
    `${baseCandidate}.html`,
  ]) {
    try {
      const candidateStat = await stat(candidate);
      if (candidateStat.isFile()) return candidate;
    } catch {}
  }
  return undefined;
}

async function startServer() {
  const server = createServer(async (request, response) => {
    const path = await staticPath(request.url ?? '/');
    if (path === undefined) {
      const notFound = await readFile(join(buildRoot, '404.html'));
      response.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      response.end(notFound);
      return;
    }
    const file = await readFile(path);
    response.writeHead(200, {
      'cache-control': 'no-store',
      'content-type': contentTypes[extname(path)] ?? 'application/octet-stream',
    });
    response.end(file);
  });

  await new Promise<void>((resolveListen, rejectListen) => {
    server.once('error', rejectListen);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', rejectListen);
      resolveListen();
    });
  });
  return {
    origin: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
    server,
  };
}

async function closeServer(server: Server) {
  await new Promise<void>((resolveClose, rejectClose) => {
    server.close((error) =>
      error === undefined ? resolveClose() : rejectClose(error),
    );
  });
}

async function holdRouteModule(page: Page, assetPattern: RegExp) {
  let releaseRequest = () => {};
  const requestGate = new Promise<void>((resolveRequest) => {
    releaseRequest = resolveRequest;
  });
  await page.route(assetPattern, async (route) => {
    await requestGate;
    await route.continue();
  });
  return releaseRequest;
}

async function setTheme(page: Page, theme: 'tinyrack-dark' | 'tinyrack-light') {
  await page.addInitScript((selectedTheme) => {
    localStorage.setItem('tinyrack-theme', selectedTheme);
  }, theme);
}

async function expectInsideViewport(page: Page, locator: Locator) {
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(box?.x).toBeGreaterThanOrEqual(-1);
  expect(box?.y).toBeGreaterThanOrEqual(-1);
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(
    (viewport?.width ?? 0) + 1,
  );
  expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(
    (viewport?.height ?? 0) + 1,
  );
}

async function expectNoLocalOverflow(locator: Locator, label: string) {
  const overflow = await locator.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(overflow.scrollWidth, label).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

describe('built React Router documentation', () => {
  let browser: Browser;
  let origin: string;
  let server: Server;

  beforeAll(async () => {
    await stat(join(buildRoot, 'index.html'));
    const started = await startServer();
    origin = started.origin;
    server = started.server;
    browser = await chromium.launch();
  });

  afterAll(async () => {
    await browser?.close();
    if (server) await closeServer(server);
  });

  for (const scenario of [
    {
      name: 'light desktop',
      theme: 'tinyrack-light',
      viewport: { height: 900, width: 1440 },
    },
    {
      name: 'dark mobile',
      theme: 'tinyrack-dark',
      viewport: { height: 844, width: 390 },
    },
  ] as const) {
    it(`renders every document in ${scenario.name}`, async () => {
      const page = await browser.newPage({ viewport: scenario.viewport });
      await setTheme(page, scenario.theme);
      const pageErrors: string[] = [];
      const consoleErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      page.on('console', (message) => {
        if (message.type() !== 'error') return;
        const source = message.location().url;
        consoleErrors.push(source ? `${message.text()} [${source}]` : message.text());
      });
      try {
        for (const documentRoute of staticDocumentRoutes) {
          await page.goto(`${origin}${documentRoute.path}`, {
            waitUntil: 'domcontentloaded',
          });
          await page
            .getByRole('heading', { level: 1, name: documentRoute.title })
            .waitFor();
          if ('entry' in documentRoute) {
            await expect(
              page.locator('[data-component-playground]').count(),
            ).resolves.toBe(1);
            await expect(
              page.locator('[data-component-example]').count(),
            ).resolves.toBeGreaterThanOrEqual(
              documentRoute.entry.requiredExamples.length,
            );
          }
          const overflow = await page.locator('html').evaluate((element) => ({
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
          }));
          expect(overflow.scrollWidth, documentRoute.path).toBeLessThanOrEqual(
            overflow.clientWidth + 1,
          );
          expect(await page.locator('html').getAttribute('data-theme')).toBe(
            scenario.theme,
          );
          await expect(page.locator('main').count()).resolves.toBe(1);
          const currentNavigationLink = page.locator(
            'nav[aria-label="Documentation"] [aria-current="page"]',
          );
          await expect
            .poll(() => currentNavigationLink.count(), {
              message: documentRoute.path,
              timeout: 10_000,
            })
            .toBe(1);
        }
        expect(pageErrors).toEqual([]);
        expect(consoleErrors).toEqual([]);
      } finally {
        await page.close();
      }
    });
  }

  it('filters navigation and persists theme selection', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      await page.goto(origin);
      await page.getByRole('searchbox', { name: 'Filter components' }).fill('button');
      await expect(
        page.getByRole('link', { name: 'Button', exact: true }).isVisible(),
      ).resolves.toBe(true);
      await expect(
        page.getByRole('link', { name: 'Accordion', exact: true }).count(),
      ).resolves.toBe(0);
      await page.getByRole('button', { name: 'Use light theme' }).click();
      expect(await page.locator('html').getAttribute('data-theme')).toBe(
        'tinyrack-light',
      );
      await page.reload();
      expect(await page.locator('html').getAttribute('data-theme')).toBe(
        'tinyrack-light',
      );
    } finally {
      await page.close();
    }
  });

  it('keeps navigation controls and foundation references usable at their target sizes', async () => {
    const mobilePage = await browser.newPage({ viewport: { height: 844, width: 390 } });
    const desktopPage = await browser.newPage({
      viewport: { height: 900, width: 1280 },
    });
    try {
      await mobilePage.goto(`${origin}/components/button`);
      for (const control of [
        mobilePage.getByRole('button', { name: 'Use light theme' }),
        mobilePage.getByRole('button', { name: 'Open navigation' }),
      ]) {
        const box = await control.boundingBox();
        expect(box?.width).toBeGreaterThanOrEqual(44);
        expect(box?.height).toBeGreaterThanOrEqual(44);
      }

      await desktopPage.goto(`${origin}/foundations/typography`);
      const search = desktopPage.getByRole('searchbox', { name: 'Filter components' });
      expect(
        Number.parseFloat(
          await search.evaluate((element) => getComputedStyle(element).paddingLeft),
        ),
      ).toBeGreaterThanOrEqual(36);
      const reference = desktopPage.locator('[data-foundation-reference="typography"]');
      await expect(
        reference.evaluate((element) => element.scrollWidth),
      ).resolves.toBeGreaterThan(0);
      await expect(
        reference.locator('xpath=..').getAttribute('tabindex'),
      ).resolves.toBe('0');
    } finally {
      await mobilePage.close();
      await desktopPage.close();
    }
  });

  it('keeps narrow foundation references and repaired preview canvases locally usable', async () => {
    const page = await browser.newPage({ viewport: { height: 844, width: 390 } });
    try {
      for (const foundation of ['radius', 'controls', 'elevation']) {
        await page.goto(`${origin}/foundations/${foundation}`);
        const table = page.locator(`[data-foundation-reference="${foundation}"]`);
        const scroller = table.locator('xpath=..');
        await expect(scroller.getAttribute('tabindex')).resolves.toBe('0');
        await scroller.focus();
        const before = await scroller.evaluate((element) => element.scrollLeft);
        for (let press = 0; press < 10; press += 1) {
          await page.keyboard.press('ArrowRight');
        }
        await expect
          .poll(() => scroller.evaluate((element) => element.scrollLeft))
          .toBeGreaterThan(before);
        const fragmentedCells = await table
          .locator('th, td')
          .evaluateAll(
            (cells) =>
              cells.filter((cell) => cell.scrollWidth > cell.clientWidth + 1).length,
          );
        expect(fragmentedCells).toBe(0);
      }

      for (const [path, exampleIds] of [
        ['/components/collapsible', ['collapsible-basic', 'collapsible-lifecycle']],
        [
          '/components/field',
          ['field-basic', 'field-field-states', 'field-validation'],
        ],
        [
          '/components/radio-group',
          ['radio-group-basic', 'radio-group-states', 'radio-group-validation'],
        ],
        ['/components/scroll-area', ['scroll-area-basic', 'scroll-area-states']],
        ['/components/slider', ['slider-validation']],
        ['/components/switch', ['switch-basic', 'switch-states', 'switch-validation']],
      ] as const) {
        await page.goto(`${origin}${path}`);
        for (const exampleId of exampleIds) {
          await expectNoLocalOverflow(
            page
              .locator(`[data-component-example-id="${exampleId}"]`)
              .locator('[data-preview-layout]'),
            `${path}#${exampleId}`,
          );
        }
      }

      await page.goto(`${origin}/components/radio-group`);
      const radioGroups = page.getByRole('radiogroup');
      await expect(radioGroups.count()).resolves.toBeGreaterThan(0);
      await expect(page.getByRole('radiogroup', { name: /.+/ }).count()).resolves.toBe(
        await radioGroups.count(),
      );
      const radios = page.getByRole('radio');
      await expect(page.getByRole('radio', { name: /.+/ }).count()).resolves.toBe(
        await radios.count(),
      );

      await page.goto(`${origin}/components/switch`);
      const switches = page.getByRole('switch');
      await expect(page.getByRole('switch', { name: /.+/ }).count()).resolves.toBe(
        await switches.count(),
      );
    } finally {
      await page.close();
    }
  });

  it('closes mobile navigation on route changes and preserves browser history', async () => {
    const page = await browser.newPage({ viewport: { height: 844, width: 390 } });
    try {
      await page.goto(origin);
      await page.getByRole('button', { name: 'Open navigation' }).click();
      const navigation = page.getByRole('navigation', { name: 'Documentation' });
      await navigation.getByRole('link', { name: 'Button', exact: true }).click();
      await page.getByRole('heading', { level: 1, name: 'Button' }).waitFor();
      await expect(navigation.isVisible()).resolves.toBe(false);
      await page.goBack();
      await page.getByRole('heading', { level: 1, name: 'Tinyrack UI' }).waitFor();
      await page.goForward();
      await page.getByRole('heading', { level: 1, name: 'Button' }).waitFor();
    } finally {
      await page.close();
    }
  });

  it('shows global and link-level feedback while a document route is loading', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    const buttonRouteModule = /\/assets\/button\.docs-[^/]+\.js$/;
    const releaseRouteModule = await holdRouteModule(page, buttonRouteModule);
    try {
      await page.goto(origin);
      const navigation = page.getByRole('navigation', { name: 'Documentation' });
      const currentLink = navigation.getByRole('link', {
        name: 'Tinyrack UI',
        exact: true,
      });
      const pendingLink = navigation.getByRole('link', {
        name: 'Button',
        exact: true,
      });
      const routeModuleRequest = page.waitForRequest(buttonRouteModule);

      await pendingLink.click();
      await routeModuleRequest;

      await page.getByRole('progressbar', { name: 'Loading page' }).waitFor();
      await expect(
        page.getByRole('heading', { level: 1, name: 'Tinyrack UI' }).isVisible(),
      ).resolves.toBe(true);
      await expect(currentLink.getAttribute('aria-current')).resolves.toBe('page');
      await expect(pendingLink.getAttribute('aria-current')).resolves.toBeNull();
      await expect(pendingLink.locator('.tr-spinner').count()).resolves.toBe(1);
      await expect(
        pendingLink.locator('.tr-spinner').getAttribute('aria-hidden'),
      ).resolves.toBe('true');
      await expect(
        page.locator('.tr-site-content').getAttribute('aria-busy'),
      ).resolves.toBe('true');

      releaseRouteModule();
      await page.getByRole('heading', { level: 1, name: 'Button' }).waitFor();

      await expect(
        page.getByRole('progressbar', { name: 'Loading page' }).count(),
      ).resolves.toBe(0);
      await expect(
        page.locator('.tr-site-content').getAttribute('aria-busy'),
      ).resolves.toBeNull();
      await expect(pendingLink.locator('.tr-spinner').count()).resolves.toBe(0);
      await expect(pendingLink.getAttribute('aria-current')).resolves.toBe('page');
      await expect(currentLink.getAttribute('aria-current')).resolves.toBeNull();
    } finally {
      releaseRouteModule();
      await page.close();
    }
  });

  it('keeps global route feedback visible after the mobile navigation closes', async () => {
    const viewport = { height: 844, width: 390 };
    const page = await browser.newPage({ viewport });
    const cardRouteModule = /\/assets\/card\.docs-[^/]+\.js$/;
    const releaseRouteModule = await holdRouteModule(page, cardRouteModule);
    try {
      await page.goto(origin);
      await page.getByRole('button', { name: 'Open navigation' }).click();
      const navigation = page.getByRole('navigation', { name: 'Documentation' });
      const routeModuleRequest = page.waitForRequest(cardRouteModule);

      await navigation.getByRole('link', { name: 'Card', exact: true }).click();
      await routeModuleRequest;

      await expect(navigation.isVisible()).resolves.toBe(false);
      const progress = page.getByRole('progressbar', { name: 'Loading page' });
      await progress.waitFor();
      const progressBox = await progress.boundingBox();
      expect(progressBox).not.toBeNull();
      expect(progressBox?.x).toBe(0);
      expect(progressBox?.y).toBe(0);
      expect(progressBox?.width).toBe(viewport.width);
      expect(progressBox?.height).toBeGreaterThan(0);
      await expect(
        page.locator('.tr-site-content').getAttribute('aria-busy'),
      ).resolves.toBe('true');

      releaseRouteModule();
      await page.getByRole('heading', { level: 1, name: 'Card' }).waitFor();
      await expect(progress.count()).resolves.toBe(0);
      await expect(
        page.locator('.tr-site-content').getAttribute('aria-busy'),
      ).resolves.toBeNull();
    } finally {
      releaseRouteModule();
      await page.close();
    }
  });

  it('updates controls from inputs and component interaction, then resets', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      await page.goto(`${origin}/components/toggle`);
      const preview = page.locator('[data-playground-preview]');
      const pressedControl = page.locator('[data-playground-control="pressed"] input');
      const toggle = preview.getByRole('button', { name: 'Bold' });
      await pressedControl.check();
      await expect(toggle.getAttribute('aria-pressed')).resolves.toBe('true');
      await toggle.click();
      await expect(pressedControl.isChecked()).resolves.toBe(false);
      await pressedControl.check();
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
      await expect(pressedControl.isChecked()).resolves.toBe(false);

      await page.goto(`${origin}/components/progress`);
      const range = page.locator('[data-playground-control="value"] input');
      await range.fill('72');
      await expect(
        page
          .locator('[data-playground-preview] [role="progressbar"]')
          .getAttribute('aria-valuenow'),
      ).resolves.toBe('72');

      await page.goto(`${origin}/components/checkbox-group`);
      const checklist = page.locator('[data-playground-control="selectedValues"]');
      await expect(checklist.getByRole('checkbox').count()).resolves.toBeGreaterThan(1);

      await page.goto(`${origin}/components/accordion`);
      const jsonControl = page.locator('[data-playground-control="value"] textarea');
      await jsonControl.fill('not-json');
      await expect(jsonControl.getAttribute('aria-invalid')).resolves.toBe('true');

      await page.goto(`${origin}/components/button`);
      const select = page.locator('[data-playground-control="variant"] select');
      await select.selectOption({ label: 'danger' });
      await expect(
        page.locator('[data-playground-preview] .tr-btn').getAttribute('data-variant'),
      ).resolves.toBe('danger');
    } finally {
      await page.close();
    }
  });

  it('keeps stateful Playground controls synchronized in both directions', async () => {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    try {
      await page.goto(`${origin}/components/drawer`);
      const drawerOpen = page.locator('[data-playground-control="open"] input');
      await drawerOpen.check();
      const drawer = page.getByRole('dialog', { name: 'Rack settings' });
      await drawer.waitFor();
      await drawer.getByRole('button', { name: 'Close', exact: true }).click();
      await expect(drawerOpen.isChecked()).resolves.toBe(false);
      const drawerLabel = page.locator('[data-playground-control="label"] input');
      await drawerLabel.fill('Open deployment settings');
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
      await expect(drawerOpen.isChecked()).resolves.toBe(false);
      await expect(drawerLabel.inputValue()).resolves.toBe('Open settings');

      await page.goto(`${origin}/components/form`);
      const formValue = page.locator('[data-playground-control="value"] input');
      const rackInput = page
        .locator('[data-playground-preview]')
        .getByRole('textbox', { name: 'Rack name' });
      await formValue.fill('rack-beta');
      await expect(rackInput.inputValue()).resolves.toBe('rack-beta');
      await rackInput.fill('rack-gamma');
      await expect(formValue.inputValue()).resolves.toBe('rack-gamma');
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
      await expect(rackInput.inputValue()).resolves.toBe('rack-alpha');

      await page.goto(`${origin}/components/number-field`);
      const numberValue = page.locator('[data-playground-control="value"] input');
      const replicas = page
        .locator('[data-playground-preview]')
        .getByRole('textbox', { name: 'Replicas' });
      await numberValue.fill('7');
      await expect(replicas.inputValue()).resolves.toBe('7');
      await replicas.focus();
      await page.keyboard.press('ArrowUp');
      await expect(numberValue.inputValue()).resolves.toBe('8');
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
      await expect(replicas.inputValue()).resolves.toBe('3');

      await page.goto(`${origin}/components/otp-field`);
      const otpValue = page.locator('[data-playground-control="value"] input');
      const otpInputs = page.locator('[data-playground-preview] .tr-otp-field-digit');
      await otpValue.fill('1234');
      await expect
        .poll(() =>
          otpInputs.evaluateAll((inputs) =>
            inputs.map((input) => (input as HTMLInputElement).value).join(''),
          ),
        )
        .toBe('1234');
      await otpValue.fill('');
      await otpInputs.first().focus();
      await page.keyboard.type('2468');
      await expect(otpValue.inputValue()).resolves.toBe('2468');
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
      await expect(otpValue.inputValue()).resolves.toBe('');

      await page.goto(`${origin}/components/select`);
      const selectValue = page.locator('[data-playground-control="value"] select');
      const selectOpen = page.locator('[data-playground-control="open"] input');
      const selectTrigger = page
        .locator('[data-playground-preview]')
        .getByRole('combobox', { name: 'Deployment rack' });
      await selectValue.selectOption('beta');
      await expect(selectTrigger.textContent()).resolves.toContain('Rack Beta');
      await selectTrigger.click();
      await expect.poll(() => selectOpen.isChecked()).toBe(true);
      await page.getByRole('option', { name: 'Staging rack' }).click();
      await expect
        .poll(() =>
          selectValue.evaluate(
            (select) => (select as HTMLSelectElement).selectedOptions[0]?.textContent,
          ),
        )
        .toBe('staging');
      await expect.poll(() => selectOpen.isChecked()).toBe(false);
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
      await expect
        .poll(() =>
          selectValue.evaluate(
            (select) => (select as HTMLSelectElement).selectedOptions[0]?.textContent,
          ),
        )
        .toBe('alpha');

      await page.goto(`${origin}/components/slider`);
      const sliderValue = page.locator('[data-playground-control="value"] input');
      const sliderThumb = page
        .locator('[data-playground-preview]')
        .getByRole('slider', { name: 'Volume' });
      await sliderValue.fill('72');
      await expect(sliderThumb.getAttribute('aria-valuenow')).resolves.toBe('72');
      await sliderThumb.focus();
      await page.keyboard.press('ArrowRight');
      await expect(sliderValue.inputValue()).resolves.toBe('73');
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
      await expect(sliderValue.inputValue()).resolves.toBe('48');

      await page.goto(`${origin}/components/switch`);
      const switchChecked = page.locator('[data-playground-control="checked"] input');
      const switchControl = page
        .locator('[data-playground-preview]')
        .getByRole('switch', { name: 'Automatic updates' });
      await switchChecked.uncheck();
      await expect(switchControl.isChecked()).resolves.toBe(false);
      await switchControl.click();
      await expect(switchChecked.isChecked()).resolves.toBe(true);
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
      await expect(switchChecked.isChecked()).resolves.toBe(true);

      await page.goto(`${origin}/components/toggle-group`);
      const groupValue = page.locator('[data-playground-control="value"] textarea');
      const group = page
        .locator('[data-playground-preview]')
        .getByRole('group', { name: 'Text alignment' });
      await groupValue.fill('["center"]');
      await expect(
        group.getByRole('button', { name: 'Center' }).getAttribute('aria-pressed'),
      ).resolves.toBe('true');
      await group.getByRole('button', { name: 'End' }).click();
      await expect.poll(() => groupValue.inputValue()).toContain('end');
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
      await expect.poll(() => groupValue.inputValue()).toContain('start');
    } finally {
      await page.close();
    }
  });

  it('keeps code examples, dialogs, selects, and mobile navigation interactive', async () => {
    const page = await browser.newPage({ viewport: { height: 844, width: 390 } });
    try {
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], {
        origin,
      });
      await page.goto(`${origin}/components/button`);
      const example = page.locator('[data-component-example-id="button-basic"]');
      await example.getByRole('tab', { name: 'React' }).click();
      await expect(
        example.locator('[data-component-example-source="react"]').isVisible(),
      ).resolves.toBe(true);
      const copyButton = example.getByRole('button', {
        name: 'Copy React source for Basic action',
      });
      await copyButton.click();
      await expect.poll(() => copyButton.textContent()).toBe('Copied');

      await page.goto(`${origin}/components/dialog`);
      await page
        .locator('[data-component-example-id="dialog-basic"]')
        .getByRole('button', { name: 'Open dialog' })
        .click();
      await expect(page.getByRole('dialog').isVisible()).resolves.toBe(true);
      await expectInsideViewport(page, page.getByRole('dialog'));
      await page.keyboard.press('Escape');
      await expect.poll(() => page.getByRole('dialog').isVisible()).toBe(false);

      await page.goto(`${origin}/components/select`);
      await page
        .locator('[data-component-example-id="select-basic"]')
        .getByRole('combobox')
        .click();
      await expectInsideViewport(page, page.locator('.tr-select-popup'));
      await page.getByRole('option', { name: 'Rack Beta' }).click();

      await page.goto(`${origin}/components/toast`);
      await page
        .locator('[data-component-example-id="toast-basic"]')
        .getByRole('button', { name: 'Show toast' })
        .click();
      await page.locator('.tr-toast').waitFor();
      await expectInsideViewport(page, page.locator('.tr-toast'));

      await page.goto(origin);
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await expect(
        page.getByRole('navigation', { name: 'Documentation' }).isVisible(),
      ).resolves.toBe(true);
    } finally {
      await page.close();
    }
  });

  it('accepts complex popup and menu contracts at mobile bounds', async () => {
    const page = await browser.newPage({ viewport: { height: 844, width: 390 } });
    try {
      await page.goto(`${origin}/components/menubar`);
      const menubarExample = page.locator(
        '[data-component-example-id="menubar-states"]',
      );
      const fileMenu = menubarExample.getByRole('menuitem', { name: 'File' });
      const editMenu = menubarExample.getByRole('menuitem', { name: 'Edit' });
      await fileMenu.focus();
      await page.keyboard.press('ArrowRight');
      await expect(
        editMenu.evaluate((element) => document.activeElement === element),
      ).resolves.toBe(true);
      await page.keyboard.press('Enter');
      const menuPopup = page.locator('.tr-menu-content[data-open]');
      await menuPopup.waitFor();
      await expectInsideViewport(page, menuPopup);
      await page.keyboard.press('Escape');
      await expect
        .poll(() => editMenu.evaluate((element) => document.activeElement === element))
        .toBe(true);

      await page.goto(`${origin}/components/navigation-menu`);
      const platformNavigation = page.getByRole('navigation', {
        name: 'Platform navigation example',
      });
      await expect(platformNavigation.isVisible()).resolves.toBe(true);
      const resources = platformNavigation.getByRole('button', {
        name: 'Resources',
      });
      await resources.press('Enter');
      const navigationPopup = page.locator('.tr-navigation-menu-popup[data-open]');
      await navigationPopup.waitFor();
      await expectInsideViewport(page, navigationPopup);
      await expect(
        navigationPopup.getByRole('link', { name: 'Guides' }).isVisible(),
      ).resolves.toBe(true);
      await page.keyboard.press('Escape');
      await expect
        .poll(() => resources.evaluate((element) => document.activeElement === element))
        .toBe(true);

      await page.goto(`${origin}/components/tooltip`);
      const tooltipTrigger = page
        .locator('[data-component-example-id="tooltip-basic"]')
        .getByRole('button', { name: 'Rack temperature' });
      await tooltipTrigger.focus();
      const tooltip = page.getByRole('tooltip', { name: '24°C' });
      await tooltip.waitFor();
      await expectInsideViewport(page, tooltip);
      await expect(tooltipTrigger.getAttribute('aria-describedby')).resolves.toBe(
        await tooltip.getAttribute('id'),
      );
      await page.keyboard.press('Escape');
      await expect.poll(() => tooltip.isVisible()).toBe(false);
      await expect
        .poll(() =>
          tooltipTrigger.evaluate((element) => document.activeElement === element),
        )
        .toBe(true);

      await page.goto(`${origin}/components/alert-dialog`);
      const alertTrigger = page
        .locator('[data-component-example-id="alert-dialog-basic"]')
        .getByRole('button', { name: 'Delete rack' });
      await alertTrigger.click();
      const alertDialog = page.getByRole('alertdialog', { name: 'Delete rack?' });
      await alertDialog.waitFor();
      await expectInsideViewport(page, alertDialog);
      await expect(
        alertDialog
          .getByRole('button', { name: 'Cancel' })
          .evaluate((element) => document.activeElement === element),
      ).resolves.toBe(true);
      await page.keyboard.press('Escape');
      await expect.poll(() => alertDialog.isVisible()).toBe(false);
      await expect
        .poll(() =>
          alertTrigger.evaluate((element) => document.activeElement === element),
        )
        .toBe(true);

      await page.goto(`${origin}/components/drawer`);
      const drawerTrigger = page
        .locator('[data-component-example-id="drawer-basic"]')
        .getByRole('button', { name: 'Open settings' });
      await drawerTrigger.click();
      const drawer = page.getByRole('dialog', { name: 'Rack settings' });
      await drawer.waitFor();
      await drawer.evaluate((element) =>
        Promise.all(element.getAnimations().map((animation) => animation.finished)),
      );
      await expectInsideViewport(page, drawer);
      await page.keyboard.press('Escape');
      await expect.poll(() => drawer.isVisible()).toBe(false);
      await expect
        .poll(() =>
          drawerTrigger.evaluate((element) => document.activeElement === element),
        )
        .toBe(true);

      await page.goto(`${origin}/components/preview-card`);
      const previewTrigger = page
        .locator('[data-component-example-id="preview-card-states"]')
        .getByRole('link', { name: 'Rack Beta' });
      await previewTrigger.focus();
      const previewCard = page.locator('.tr-preview-card-popup[data-open]');
      await previewCard.waitFor();
      await expectInsideViewport(page, previewCard);
      await expect(
        previewCard.getByRole('link', { name: 'View incidents' }).isVisible(),
      ).resolves.toBe(true);
      await page.keyboard.press('Escape');
      await expect.poll(() => previewCard.isVisible()).toBe(false);
      await expect
        .poll(() =>
          previewTrigger.evaluate((element) => document.activeElement === element),
        )
        .toBe(true);
    } finally {
      await page.close();
    }
  });
});
