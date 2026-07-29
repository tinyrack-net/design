import { readdir, readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import type { Plugin } from 'vite';

export const flutterDwdsHandlerPath = '/$dwdsSseHandler';

export function createFlutterPreviewProxy(target: string) {
  return {
    '/flutter-preview': {
      target,
      rewrite: (path: string) => path.replace(/^\/flutter-preview(?=\/|$)/, '') || '/',
    },
    [flutterDwdsHandlerPath]: {
      target,
      ws: true,
    },
  };
}

async function filesUnder(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) => {
        const path = resolve(directory, entry.name);
        return entry.isDirectory() ? filesUnder(path) : [path];
      }),
    )
  ).flat();
}

export async function collectFlutterPreviewAssets(previewRoot: string) {
  const files = await filesUnder(previewRoot).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Flutter preview staging output is missing at ${previewRoot}. Run pnpm flutter:preview:build before the Homepage production build. ${message}`,
    );
  });
  return Promise.all(
    files.map(async (path) => ({
      fileName: `flutter-preview/${relative(previewRoot, path).replaceAll('\\', '/')}`,
      source: await readFile(path),
    })),
  );
}

export function flutterPreviewPlugin({
  origin,
  previewRoot,
}: {
  origin?: string;
  previewRoot: string;
}): Plugin {
  return {
    name: 'tinyrack-flutter-preview',
    config: () =>
      origin === undefined
        ? undefined
        : { server: { proxy: createFlutterPreviewProxy(origin) } },
    async generateBundle() {
      if (this.environment.name !== 'client') return;
      for (const asset of await collectFlutterPreviewAssets(previewRoot)) {
        this.emitFile({ ...asset, type: 'asset' });
      }
    },
  };
}
