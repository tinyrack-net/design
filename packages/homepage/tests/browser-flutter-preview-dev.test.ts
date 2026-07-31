import { type ChildProcess, execFile, spawn } from 'node:child_process';
import net from 'node:net';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { type Browser, chromium } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const homepageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workspaceRoot = resolve(homepageRoot, '../..');
const outputLimit = 20_000;

function availablePort() {
  return new Promise<number>((resolvePort, rejectPort) => {
    const server = net.createServer();
    server.unref();
    server.once('error', rejectPort);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (typeof address !== 'object' || address === null) {
        rejectPort(new Error('Could not reserve a homepage test port.'));
        return;
      }
      server.close(() => resolvePort(address.port));
    });
  });
}

function stopProcessTree(child: ChildProcess | undefined) {
  if (child?.pid === undefined || child.exitCode !== null) return Promise.resolve();

  if (process.platform === 'win32') {
    return new Promise<void>((resolveStop) => {
      execFile('taskkill', ['/pid', String(child.pid), '/t', '/f'], () =>
        resolveStop(),
      );
    });
  }

  child.kill('SIGTERM');
  return new Promise<void>((resolveStop) => {
    const timeout = setTimeout(() => {
      child.kill('SIGKILL');
      resolveStop();
    }, 5_000);
    child.once('exit', () => {
      clearTimeout(timeout);
      resolveStop();
    });
  });
}

async function waitForHomepage(
  origin: string,
  child: ChildProcess,
  output: () => string,
) {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(
        `Flutter preview development server exited with ${child.exitCode}.\n${output()}`,
      );
    }
    try {
      const response = await fetch(`${origin}/en/flutter/components/card/`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolveWait) => setTimeout(resolveWait, 250));
  }
  throw new Error(`Timed out waiting for ${origin}.\n${output()}`);
}

describe('Flutter preview development server', () => {
  let browser: Browser | undefined;
  let developmentServer: ChildProcess | undefined;
  let origin = '';
  let output = '';

  beforeAll(async () => {
    const port = await availablePort();
    origin = `http://127.0.0.1:${port}`;
    developmentServer = spawn(
      process.execPath,
      [
        resolve(workspaceRoot, 'scripts/dev-with-flutter.ts'),
        '--host',
        '127.0.0.1',
        '--port',
        String(port),
      ],
      {
        cwd: workspaceRoot,
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    const collectOutput = (chunk: Buffer) => {
      output = `${output}${chunk.toString()}`.slice(-outputLimit);
    };
    developmentServer.stdout?.on('data', collectOutput);
    developmentServer.stderr?.on('data', collectOutput);

    await waitForHomepage(origin, developmentServer, () => output);
    browser = await chromium.launch();
  });

  afterAll(async () => {
    await browser?.close();
    await stopProcessTree(developmentServer);
  });

  it('runs the Card widget through the proxied DWDS connection', async () => {
    if (browser === undefined) throw new Error('Browser was not started.');
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });

    try {
      await page.goto(`${origin}/en/flutter/components/card/`);
      await page.locator('html[data-hydrated="true"]').waitFor();
      const preview = page.locator('[data-flutter-preview="card"]');
      await preview.scrollIntoViewIfNeeded();
      await expect
        .poll(() => preview.getByText('Loading the Flutter preview').count(), {
          timeout: 120_000,
        })
        .toBe(0);

      const frame = page.frameLocator('iframe[data-flutter-preview-frame]');
      await expect
        .poll(() => frame.locator('flutter-view').count(), { timeout: 30_000 })
        .toBe(1);
      await expect(preview.getByRole('alert').count()).resolves.toBe(0);
    } finally {
      await page.close();
    }
  });
});
