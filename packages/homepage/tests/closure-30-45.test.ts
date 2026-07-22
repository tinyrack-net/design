import { readFile, stat } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join, resolve, sep } from 'node:path';
import { type Browser, chromium, type Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

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

async function gotoHydrated(page: Page, url: string) {
  await page.goto(url);
  await page.locator('html[data-hydrated="true"]').waitFor();
}

describe('reports 30-45 closure regressions', () => {
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

  it('keeps controlled demos, native forms, accessibility, and mobile previews aligned', async () => {
    const page = await browser.newPage({ viewport: { height: 844, width: 390 } });
    try {
      await gotoHydrated(page, `${origin}/en/components/toast`);
      const toastPreview = page.locator('[data-playground-preview]');
      const showToast = toastPreview.getByRole('button', { name: 'Show toast' });
      const toastViewport = page.locator(
        '.tr-toast-viewport[aria-label="Playground notifications"]',
      );
      await expect(
        page.locator('[data-playground-control="initiallyOpen"]').count(),
      ).resolves.toBe(0);
      await showToast.click();
      await toastPreview
        .locator('button', { hasText: 'Show toast' })
        .click({ force: true });
      await expect.poll(() => toastViewport.locator('.tr-toast').count()).toBe(1);
      await toastViewport.locator('[aria-label="Dismiss notification"]').click();
      await expect.poll(() => toastViewport.locator('.tr-toast').count()).toBe(0);

      await gotoHydrated(page, `${origin}/en/components/alert-dialog`);
      const alertExample = page.locator(
        '[data-component-example-id="alert-dialog-basic"]',
      );
      await alertExample.getByRole('button', { name: 'Delete rack' }).click();
      const alertDialog = page.getByRole('alertdialog', { name: 'Delete rack?' });
      await alertDialog.getByRole('button', { name: 'Delete rack' }).click();
      await expect.poll(() => alertDialog.isVisible()).toBe(false);
      await expect(alertExample.locator('output').textContent()).resolves.toBe(
        'Rack deleted',
      );

      await gotoHydrated(page, `${origin}/en/components/checkbox-group`);
      const groupExample = page.locator(
        '[data-component-example-id="checkbox-group-form"]',
      );
      const metrics = groupExample.getByRole('checkbox', { name: 'Metrics' });
      const alerts = groupExample.getByRole('checkbox', { name: 'Alerts' });
      const backups = groupExample.getByRole('checkbox', {
        name: 'Automated backups',
      });
      await expect(metrics.getAttribute('aria-checked')).resolves.toBe('true');
      await alerts.click();
      await backups.click();
      await groupExample.getByRole('button', { name: 'Save features' }).click();
      await groupExample.getByText('Select no more than two features.').waitFor();
      await backups.click();
      await expect
        .poll(() =>
          groupExample.getByText('Select no more than two features.').isVisible(),
        )
        .toBe(false);
      await groupExample.getByRole('button', { name: 'Save features' }).click();
      await expect(groupExample.locator('output').textContent()).resolves.toBe(
        'Saved: metrics, alerts.',
      );
      await metrics.click();
      await alerts.click();
      await groupExample.getByRole('button', { name: 'Save features' }).click();
      await groupExample.getByText('Select at least one feature.').waitFor();

      await gotoHydrated(page, `${origin}/en/components/fieldset`);
      const fieldsetOverflow = await page
        .locator('[data-playground-preview]')
        .evaluate((element) => ({
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
        }));
      expect(fieldsetOverflow.scrollWidth).toBeLessThanOrEqual(
        fieldsetOverflow.clientWidth + 1,
      );

      await gotoHydrated(page, `${origin}/en/components/form`);
      const nativeForm = page.locator('[data-component-example-id="form-basic"]');
      const nativeInput = nativeForm.getByRole('textbox', { name: 'Rack name' });
      await nativeInput.fill('rack-zeta');
      await nativeForm.getByRole('button', { name: 'Submit rack' }).click();
      await expect(nativeForm.locator('output').textContent()).resolves.toBe(
        'Submitted rack-zeta.',
      );
      await nativeInput.fill('temporary');
      await nativeForm.getByRole('button', { name: 'Reset form' }).click();
      await expect
        .poll(() =>
          nativeInput.evaluate((element) => (element as HTMLInputElement).value),
        )
        .toBe('rack-alpha');
      await expect(nativeForm.locator('output').textContent()).resolves.toBe('');

      const serverForm = page.locator(
        '[data-component-example-id="form-server-errors"]',
      );
      const serverInput = serverForm.getByRole('textbox', { name: 'Rack name' });
      await serverForm.getByRole('button', { name: 'Create rack' }).click();
      const serverError = serverForm.getByText('Rack Alpha already exists.');
      await serverError.waitFor();
      await expect(serverInput.getAttribute('aria-describedby')).resolves.toContain(
        await serverError.getAttribute('id'),
      );
      await serverInput.fill('rack-beta');
      await expect.poll(() => serverError.isVisible()).toBe(false);
      await serverForm.getByRole('button', { name: 'Create rack' }).click();
      await expect(serverForm.locator('output').textContent()).resolves.toBe(
        'Created rack-beta.',
      );

      await gotoHydrated(page, `${origin}/en/components/menubar`);
      const menubarExample = page.locator(
        '[data-component-example-id="menubar-states"]',
      );
      await menubarExample.getByRole('tab', { name: 'React' }).click();
      const source = await menubarExample
        .locator('[data-component-example-source="react"]')
        .textContent();
      expect(source).toContain('TRMenu.CheckboxItem');
      expect(source).toContain('TRMenu.LinkItem');
      expect(source).toContain('Duplicate unavailable');
      expect(source).toContain('setResult');
    } finally {
      await page.close();
    }
  });
});
