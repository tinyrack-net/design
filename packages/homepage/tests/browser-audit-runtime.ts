import { readFile, stat } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join, resolve, sep } from 'node:path';
import { type Browser, chromium, type Locator, type Page } from 'playwright';
import sharp from 'sharp';
import { expect } from 'vitest';
import { componentDocsManifest } from '../app/documentation/shared/component-docs-manifest.js';

export { componentDocsManifest, sharp };

const buildRoot = join(process.cwd(), 'build/client');

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pagefind': 'application/wasm',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.ttf': 'font/ttf',
  '.wasm': 'application/wasm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
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
  server.closeAllConnections();
  await new Promise<void>((resolveClose, rejectClose) => {
    server.close((error) =>
      error === undefined ? resolveClose() : rejectClose(error),
    );
  });
}

export async function holdRouteModule(page: Page, assetPattern: RegExp) {
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

export async function setTheme(page: Page, theme: 'tinyrack-dark' | 'tinyrack-light') {
  await page.addInitScript((selectedTheme) => {
    localStorage.setItem('tinyrack-theme', selectedTheme);
  }, theme);
}

export async function waitForHydration(page: Page) {
  await page.locator('html[data-hydrated="true"]').waitFor();
}

export async function gotoHydrated(page: Page, url: string) {
  await page.goto(url);
  await waitForHydration(page);
}

export async function expectVisible(locator: Locator) {
  await locator.waitFor({ state: 'visible' });
}

export async function expectHidden(locator: Locator) {
  await locator.waitFor({ state: 'hidden' });
}

export async function expectInsideViewport(page: Page, locator: Locator) {
  await expect
    .poll(async () => {
      const box = await locator.boundingBox();
      const viewport = page.viewportSize();
      if (box === null || viewport === null) return false;

      return (
        box.x >= -1 &&
        box.y >= -1 &&
        box.x + box.width <= viewport.width + 1 &&
        box.y + box.height <= viewport.height + 1
      );
    })
    .toBe(true);
}

export async function expectHorizontallyInsideViewport(page: Page, locator: Locator) {
  await expect
    .poll(async () => {
      const box = await locator.boundingBox();
      const viewport = page.viewportSize();
      if (box === null || viewport === null) return false;

      return box.x >= -1 && box.x + box.width <= viewport.width + 1;
    })
    .toBe(true);
}

export type SettledBox = {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
};

/**
 * Wait until every finite animation on the element and its subtree has
 * finished.
 *
 * Two details matter and are easy to get wrong:
 *
 * - `Animation.finished` *rejects* with `AbortError` when the animation is
 *   cancelled, which Base UI does routinely when a popup re-renders or closes
 *   mid-settle. Each promise is caught individually so one cancellation cannot
 *   take down the wait.
 * - Indefinite animations (spinner, skeleton shimmer, the Welcome simulation)
 *   never resolve, so they are filtered out by their computed end time. Without
 *   that filter this helper hangs on any page carrying a looping animation.
 *
 * Finishing an enter transition frequently starts a follow-up as the Base UI
 * positioner reflows, so the collect-and-await pass runs twice.
 */
export async function settleMotion(locator: Locator) {
  await locator.evaluate(async (element) => {
    const finiteAnimations = () =>
      element.getAnimations({ subtree: true }).filter((animation) => {
        const endTime = animation.effect?.getComputedTiming().endTime;
        return Number.isFinite(Number(endTime ?? Number.POSITIVE_INFINITY));
      });

    for (let pass = 0; pass < 2; pass += 1) {
      await Promise.all(
        finiteAnimations().map((animation) =>
          animation.finished.catch(() => undefined),
        ),
      );
    }

    await new Promise<void>((resolveFrame) =>
      requestAnimationFrame(() => resolveFrame()),
    );
  });
}

/**
 * Wait for motion to finish, then for the box to stop moving, and return it.
 *
 * The stability loop runs inside a single `evaluate` on purpose. Polling
 * `boundingBox()` from the test side costs a protocol round trip per sample,
 * and under load those samples arrive unevenly — which is the jitter this is
 * meant to remove, not add.
 *
 * The second stage exists because `settleMotion` only covers what the Web
 * Animations API exposes; scrollbar appearance, font swaps and Base UI
 * repositioning all move a box without registering an animation.
 */
export async function settledBox(
  locator: Locator,
  { tolerance = 0.5 }: { tolerance?: number } = {},
): Promise<SettledBox> {
  await settleMotion(locator);

  const settled = await locator.evaluate(async (element, allowed: number) => {
    const read = () => {
      const rect = element.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        width: rect.width,
        x: rect.x,
        y: rect.y,
      };
    };

    let previous = read();
    let stableFrames = 0;
    for (let frame = 0; frame < 120; frame += 1) {
      await new Promise<void>((resolveFrame) =>
        requestAnimationFrame(() => resolveFrame()),
      );
      const current = read();
      const moved = (['x', 'y', 'width', 'height'] as const).some(
        (axis) => Math.abs(current[axis] - previous[axis]) >= allowed,
      );
      stableFrames = moved ? 0 : stableFrames + 1;
      previous = current;
      if (stableFrames >= 6) return current;
    }
    return null;
  }, tolerance);

  if (settled === null) {
    // Returning the last sample here would trade a loud failure for a quiet
    // one; a box that never stops moving is a defect worth surfacing.
    throw new Error(
      `Element did not settle within 120 frames (tolerance ${tolerance}px): ${locator}`,
    );
  }

  return settled;
}

export async function expectVerticallyCentered(container: Locator, item: Locator) {
  const containerBox = await settledBox(container);
  const itemBox = await settledBox(item);

  const containerCenter = containerBox.y + containerBox.height / 2;
  const itemCenter = itemBox.y + itemBox.height / 2;
  expect(Math.abs(itemCenter - containerCenter)).toBeLessThanOrEqual(1.25);
}

export async function expectVerticallyContained(container: Locator, item: Locator) {
  const containerBox = await settledBox(container);
  const itemBox = await settledBox(item);

  expect(itemBox.y).toBeGreaterThanOrEqual(containerBox.y);
  expect(itemBox.y + itemBox.height).toBeLessThanOrEqual(
    containerBox.y + containerBox.height,
  );
}

export async function expectNoLocalOverflow(locator: Locator, label: string) {
  await settleMotion(locator);
  await expect
    .poll(
      async () => {
        const overflow = await locator.evaluate((element) => ({
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
        }));
        return overflow.scrollWidth <= overflow.clientWidth + 1;
      },
      { message: label },
    )
    .toBe(true);
}

export async function verticalGap(heading: Locator, content: Locator) {
  const headingBox = await settledBox(heading);
  const contentBox = await settledBox(content);
  return contentBox.y - (headingBox.y + headingBox.height);
}

export async function settledScrollTop(locator: Locator) {
  return locator.evaluate(async (element) => {
    let previous = element.scrollTop;
    let stableFrames = 0;
    for (let frame = 0; frame < 120; frame += 1) {
      await new Promise<void>((resolveFrame) =>
        requestAnimationFrame(() => resolveFrame()),
      );
      const current = element.scrollTop;
      stableFrames = Math.abs(current - previous) < 1 ? stableFrames + 1 : 0;
      previous = current;
      if (stableFrames >= 6) return current;
    }
    return element.scrollTop;
  });
}

export async function settledWindowScrollTop(page: Page) {
  return page.evaluate(async () => {
    let previous = window.scrollY;
    let stableFrames = 0;
    for (let frame = 0; frame < 120; frame += 1) {
      await new Promise<void>((resolveFrame) =>
        requestAnimationFrame(() => resolveFrame()),
      );
      const current = window.scrollY;
      stableFrames = Math.abs(current - previous) < 1 ? stableFrames + 1 : 0;
      previous = current;
      if (stableFrames >= 6) return current;
    }
    return window.scrollY;
  });
}

/** Ancestors that clip the element, i.e. everything between it and the viewport
 * that would stop a pinch-zoomed page from being panned. */
export async function clippingAncestors(locator: Locator) {
  return locator.evaluate((element) => {
    const chain: string[] = [];
    let node: Element | null = element;
    while (node !== null) {
      const overflowY = getComputedStyle(node).overflowY;
      if (overflowY === 'hidden' || overflowY === 'clip') {
        chain.push(node.className || node.tagName.toLowerCase());
      }
      node = node.parentElement;
    }
    return chain;
  });
}

export async function highlightedCodeColors(locator: Locator) {
  return locator.evaluate((element) => {
    const token = element.querySelector('span');
    if (token === null) throw new Error('Highlighted TRCodeBlock has no token spans.');

    return {
      background: getComputedStyle(element).backgroundColor,
      token: getComputedStyle(token).color,
    };
  });
}

export function createBrowserAuditRuntime() {
  let browser: Browser | undefined;
  let origin: string | undefined;
  let server: Server | undefined;

  return {
    get browser() {
      if (browser === undefined)
        throw new Error('Browser audit runtime is not started');
      return browser;
    },
    get origin() {
      if (origin === undefined) throw new Error('Browser audit runtime is not started');
      return origin;
    },
    async start() {
      await stat(join(buildRoot, 'index.html'));
      const started = await startServer();
      origin = started.origin;
      server = started.server;
      browser = await chromium.launch();
    },
    async stop() {
      await browser?.close();
      if (server !== undefined) await closeServer(server);
      browser = undefined;
      origin = undefined;
      server = undefined;
    },
  };
}
