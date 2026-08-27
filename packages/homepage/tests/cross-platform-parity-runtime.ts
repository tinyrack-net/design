import { readFile, stat } from 'node:fs/promises';
import { createServer as createHttpServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, resolve, sep } from 'node:path';
import { type Browser, chromium } from 'playwright';
import { createServer as createViteServer, type ViteDevServer } from 'vite';

const fixtureRoot = resolve(import.meta.dirname, 'fixtures/cross-platform-parity');
const flutterRoot = resolve(import.meta.dirname, '../../ui_flutter/example/build/web');

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.wasm': 'application/wasm',
};

async function flutterAsset(requestUrl: string) {
  const pathname = decodeURIComponent(
    new URL(requestUrl, 'http://parity.local').pathname,
  );
  if (!pathname.startsWith('/flutter-preview/')) return undefined;
  const relative = pathname.slice('/flutter-preview/'.length).replaceAll('\\', '/');
  const candidate = resolve(flutterRoot, relative || 'index.html');
  const rootPrefix = `${flutterRoot}${sep}`;
  if (candidate !== flutterRoot && !candidate.startsWith(rootPrefix)) return null;
  try {
    return (await stat(candidate)).isFile() ? candidate : null;
  } catch {
    return null;
  }
}

export async function createCrossPlatformParityRuntime() {
  let vite: ViteDevServer | undefined;
  let server: Server | undefined;
  let browser: Browser | undefined;

  return {
    get browser() {
      if (browser === undefined) throw new Error('Parity runtime is not started.');
      return browser;
    },
    get origin() {
      if (server === undefined) throw new Error('Parity runtime is not started.');
      return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    },
    async start() {
      vite = await createViteServer({
        appType: 'spa',
        configFile: false,
        esbuild: { jsx: 'automatic' },
        logLevel: 'error',
        resolve: { conditions: ['@tinyrack/source'] },
        root: fixtureRoot,
        server: { middlewareMode: true },
      });
      server = createHttpServer(async (request, response) => {
        const asset = await flutterAsset(request.url ?? '/');
        if (asset === null) {
          response.writeHead(404).end();
          return;
        }
        if (asset !== undefined) {
          const contents = await readFile(asset);
          response.writeHead(200, {
            'cache-control': 'no-store',
            'content-type': contentTypes[extname(asset)] ?? 'application/octet-stream',
          });
          response.end(contents);
          return;
        }
        vite?.middlewares(request, response, () => {
          response.writeHead(404).end();
        });
      });
      await new Promise<void>((resolveListen, rejectListen) => {
        server?.once('error', rejectListen);
        server?.listen(0, '127.0.0.1', () => resolveListen());
      });
      browser = await chromium.launch({ headless: true });
    },
    async stop() {
      await browser?.close();
      await vite?.close();
      server?.closeAllConnections();
      if (server !== undefined) {
        await new Promise<void>((resolveClose) => server?.close(() => resolveClose()));
      }
    },
  };
}
