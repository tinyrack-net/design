import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const clientRoot = resolve(root, 'packages/homepage/build/client');
const previewRoot = resolve(clientRoot, 'flutter-preview');
const flutterFontRoot = resolve(root, 'packages/ui_flutter/assets/fonts');
// The Flutter preview catalog grows with each public component and the docs
// example builder its page adds, at roughly 8 KB per
// documented component. The select's sheet surface and its two searchable and
// surface examples bring the compiled bundle to 3,470,378 bytes. Keep a narrow
// regression margin while allowing those public catalog variants.
const maximumMainBytes = 3_480_000;
const maximumPreviewBytes = 65_000_000;
const maximumFlutterFontBytes = 16_500_000;
const expectedFlutterFonts = [
  'IBMPlexMono-Medium.otf',
  'IBMPlexMono-Regular.otf',
  'IBMPlexSans-Bold.otf',
  'IBMPlexSans-Regular.otf',
  'IBMPlexSans-SemiBold.otf',
  'IBMPlexSansJP-Bold.otf',
  'IBMPlexSansJP-Regular.otf',
  'IBMPlexSansJP-SemiBold.otf',
  'IBMPlexSansKR-Bold.otf',
  'IBMPlexSansKR-Regular.otf',
  'IBMPlexSansKR-SemiBold.otf',
];

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
const flutterFonts = (await readdir(flutterFontRoot))
  .filter((name) => name.endsWith('.otf'))
  .sort();
if (
  flutterFonts.length !== expectedFlutterFonts.length ||
  flutterFonts.some((name, index) => name !== expectedFlutterFonts[index])
) {
  throw new Error(
    `Flutter font inventory changed.\nExpected: ${expectedFlutterFonts.join(', ')}\nReceived: ${flutterFonts.join(', ')}`,
  );
}
const flutterFontBytes = (
  await Promise.all(
    flutterFonts.map(async (name) => (await stat(resolve(flutterFontRoot, name))).size),
  )
).reduce((total, size) => total + size, 0);
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
if (flutterFontBytes > maximumFlutterFontBytes) {
  throw new Error(
    `Flutter fonts are ${flutterFontBytes} bytes; budget is ${maximumFlutterFontBytes}.`,
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
  `Flutter preview budget: main=${mainBytes} bytes, total=${previewBytes} bytes, fonts=${flutterFontBytes} bytes.`,
);
