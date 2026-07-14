import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const clientRoot = join(process.cwd(), 'build/client');
const assetsRoot = join(clientRoot, 'assets');
const assets = readdirSync(assetsRoot);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const fontAssets = assets.filter((asset) => /\.(?:woff2?|ttf)$/.test(asset));
const ibmPlexAsset =
  /^ibm-plex-sans-(?:latin|kr-korean|jp-japanese)-(?:400|500|600|700)-normal-.+\.woff2?$/;

assert(
  fontAssets.length === 16,
  `Expected 16 IBM Plex Sans assets, got ${fontAssets.length}`,
);
assert(
  fontAssets.every((asset) => ibmPlexAsset.test(asset)),
  `Unexpected web font assets: ${fontAssets.filter((asset) => !ibmPlexAsset.test(asset)).join(', ')}`,
);
for (const weight of ['400', '500', '600', '700']) {
  assert(
    fontAssets.some((asset) => asset.startsWith(`ibm-plex-sans-latin-${weight}-`)),
    `Missing IBM Plex Sans Latin ${weight}`,
  );
  assert(
    fontAssets.some((asset) => asset.startsWith(`ibm-plex-sans-kr-korean-${weight}-`)),
    `Missing IBM Plex Sans KR ${weight}`,
  );
  assert(
    fontAssets.some((asset) =>
      asset.startsWith(`ibm-plex-sans-jp-japanese-${weight}-`),
    ),
    `Missing IBM Plex Sans JP ${weight}`,
  );
}

const forbiddenAssets = assets.filter((asset) =>
  /(?:bundle-web|wasm-|\.wasm$|angular-|cpp-|php-|python-|vue-vine)/i.test(asset),
);
assert(
  forbiddenAssets.length === 0,
  `Forbidden broad Shiki assets: ${forbiddenAssets.join(', ')}`,
);

const requiredHighlightChunks = [
  'homepage-highlighter-',
  'typescript-',
  'tsx-',
  'javascript-',
  'jsx-',
  'json-',
  'css-',
  'html-',
  'shellscript-',
  'github-dark-',
  'github-light-',
  'dark-plus-',
  'light-plus-',
];
const highlightAssets = requiredHighlightChunks.map((prefix) => {
  const asset = assets.find((candidate) => candidate.startsWith(prefix));
  assert(asset !== undefined, `Missing highlight chunk ${prefix}`);
  return asset;
});

function htmlFilesUnder(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory()
      ? htmlFilesUnder(path)
      : path.endsWith('.html')
        ? [path]
        : [];
  });
}

const eagerHighlightPreloads = htmlFilesUnder(clientRoot).flatMap((path) => {
  const html = readFileSync(path, 'utf8');
  return highlightAssets
    .filter((asset) => html.includes(`rel="modulepreload" href="/assets/${asset}"`))
    .map((asset) => `${path}: ${asset}`);
});
assert(
  eagerHighlightPreloads.length === 0,
  `Highlighting must remain lazy: ${eagerHighlightPreloads.join(', ')}`,
);

console.log(
  `homepage asset audit passed (${assets.length} assets, ${fontAssets.length} fonts)`,
);
