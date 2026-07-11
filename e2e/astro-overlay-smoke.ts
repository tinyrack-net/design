import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = resolve('artifacts/astro-overlay');
const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(
    new URL(request.url ?? '/', 'http://astro-overlay.local').pathname,
  );
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  let filePath = resolve(root, relativePath);

  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
    response.writeHead(404).end();
    return;
  }

  try {
    if ((await stat(filePath)).isDirectory()) {
      filePath = join(filePath, 'index.html');
    }
    response.writeHead(200, {
      'content-type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
    });
    response.end(await readFile(filePath));
  } catch {
    response.writeHead(404).end();
  }
});

await new Promise<void>((resolveListen, rejectListen) => {
  server.once('error', rejectListen);
  server.listen(0, '127.0.0.1', () => {
    server.off('error', rejectListen);
    resolveListen();
  });
});

const { port } = server.address() as AddressInfo;
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}`);

  await page.locator('#storage-summary').click();
  await page.locator('[data-tr-accordion-item][data-value="storage"][open]').waitFor();
  if (
    await page
      .locator('[data-tr-accordion-item][data-value="network"]')
      .evaluate((element) => (element as HTMLDetailsElement).open)
  ) {
    throw new Error('Astro single Accordion should close the previous item.');
  }
  await page.locator('#storage-summary').press('ArrowUp');
  if ((await page.evaluate(() => document.activeElement?.id)) !== 'network-summary') {
    throw new Error('Astro Accordion should provide summary arrow navigation.');
  }

  await page.locator('#open-actions').click();
  await page.locator('#rack-actions:popover-open').waitFor();
  await page.locator('#open-settings').click();
  await page.locator('#rack-settings:modal').waitFor();

  if (
    await page
      .locator('#rack-actions')
      .evaluate((element) => element.matches(':popover-open'))
  ) {
    throw new Error('Opening an Astro Modal should close the existing Layer.');
  }

  await page.locator('#rack-settings .tr-modal-backdrop').click({
    position: { x: 5, y: 5 },
  });
  await page.locator('#rack-settings:modal').waitFor({ state: 'hidden' });

  await page.locator('#open-actions').click();
  await page.locator('#rack-actions:popover-open').waitFor();
  await page.locator('#swap-fixture').click();
  await page.locator('#open-swapped').click();
  await page.locator('#swapped-modal:modal').waitFor();

  const placement = await page.locator('#swapped-modal').getAttribute('data-placement');
  if (placement !== 'end') {
    throw new Error(`Expected swapped Modal placement end, received ${placement}.`);
  }

  const builtScripts = await Promise.all(
    (
      await page
        .locator('script[src]')
        .evaluateAll((scripts) =>
          scripts.map((script) => (script as HTMLScriptElement).src),
        )
    ).map(async (url) => (await fetch(url)).text()),
  );
  if (builtScripts.some((source) => /react-dom|react\/jsx-runtime/.test(source))) {
    throw new Error('Astro DOM component bundle must not include React.');
  }

  console.log('Astro Accordion and Overlay build/browser smoke test passed');
} finally {
  await browser.close();
  await new Promise<void>((resolveClose, rejectClose) => {
    server.close((error) =>
      error === undefined ? resolveClose() : rejectClose(error),
    );
  });
}
