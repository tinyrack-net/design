import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const clientRoot = resolve(root, 'packages/homepage/build/client');
const previewRoot = resolve(clientRoot, 'flutter-preview');
const maximumMainBytes = 3_000_000;
const maximumPreviewBytes = 65_000_000;

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

const previewFiles = await filesUnder(previewRoot);
const previewBytes = (
  await Promise.all(previewFiles.map(async (path) => (await stat(path)).size))
).reduce((total, size) => total + size, 0);
const mainBytes = (await stat(resolve(previewRoot, 'main.dart.js'))).size;

if (mainBytes > maximumMainBytes) {
  throw new Error(
    `Flutter main.dart.js is ${mainBytes} bytes; budget is ${maximumMainBytes}.`,
  );
}
if (previewBytes > maximumPreviewBytes) {
  throw new Error(
    `Flutter preview is ${previewBytes} bytes; budget is ${maximumPreviewBytes}.`,
  );
}

const homepageScripts = (await filesUnder(clientRoot)).filter(
  (path) => !path.startsWith(previewRoot) && /\.(?:js|mjs)$/.test(path),
);
for (const path of homepageScripts) {
  const source = await readFile(path, 'utf8');
  if (source.includes('main.dart.js') || source.includes('flutter_bootstrap.js')) {
    throw new Error(
      `Homepage bundle ${relative(clientRoot, path)} embeds the Flutter runtime.`,
    );
  }
}

console.log(
  `Flutter preview budget: main=${mainBytes} bytes, total=${previewBytes} bytes.`,
);
