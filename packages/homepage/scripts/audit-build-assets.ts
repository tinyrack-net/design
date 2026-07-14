import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { staticDocumentRoutes } from '../app/content/shared/static-document-routes.ts';

const clientRoot = join(process.cwd(), 'build/client');
const assetsRoot = join(clientRoot, 'assets');
const pagefindRoot = join(clientRoot, 'pagefind');
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

const sitemapPath = join(clientRoot, 'sitemap.xml');
const robotsPath = join(clientRoot, 'robots.txt');
const faviconPath = join(clientRoot, 'favicon.svg');
const brandAssetRoot = join(clientRoot, 'brand');
const socialCardRoot = join(clientRoot, 'og');
const spaFallbackPath = join(clientRoot, '__spa-fallback.html');

assert(existsSync(sitemapPath), 'Missing generated sitemap.xml');
assert(existsSync(robotsPath), 'Missing generated robots.txt');
assert(existsSync(faviconPath), 'Missing stable favicon.svg');
for (const asset of [
  'tinyrack-mark.svg',
  'tinyrack-mark-inverse.svg',
  'tinyrack-lockup.svg',
  'tinyrack-lockup-inverse.svg',
  'tinyrack-app-icon.svg',
]) {
  assert(existsSync(join(brandAssetRoot, asset)), `Missing brand asset: ${asset}`);
}
assert(existsSync(socialCardRoot), 'Missing generated social cards');
assert(
  !existsSync(spaFallbackPath),
  'Unknown routes must use the noindex 404 page, not an indexable SPA fallback',
);

const sitemap = readFileSync(sitemapPath, 'utf8');
assert(
  [...sitemap.matchAll(/<loc>/g)].length === staticDocumentRoutes.length,
  'Sitemap route count does not match the static document manifest',
);
assert(
  readFileSync(robotsPath, 'utf8').includes(
    'Sitemap: https://design.tinyrack.net/sitemap.xml',
  ),
  'robots.txt must advertise the canonical sitemap',
);

const socialCards = readdirSync(socialCardRoot, { recursive: true }).filter(
  (path) => typeof path === 'string' && path.endsWith('.png'),
);
assert(
  socialCards.length === staticDocumentRoutes.length,
  `Expected ${staticDocumentRoutes.length} social cards, got ${socialCards.length}`,
);

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

const requiredPagefindFiles = [
  'pagefind-entry.json',
  'pagefind-worker.js',
  'pagefind.js',
  'wasm.en.pagefind',
];
for (const file of requiredPagefindFiles) {
  assert(statSync(join(pagefindRoot, file)).isFile(), `Missing Pagefind asset ${file}`);
}
const pagefindFragments = readdirSync(join(pagefindRoot, 'fragment')).filter((file) =>
  file.endsWith('.pf_fragment'),
);
const pagefindIndexes = readdirSync(join(pagefindRoot, 'index')).filter((file) =>
  file.endsWith('.pf_index'),
);
assert(pagefindFragments.length > 0, 'Pagefind did not emit document fragments');
assert(pagefindIndexes.length > 0, 'Pagefind did not emit index chunks');

const eagerPagefindReferences = htmlFilesUnder(clientRoot).filter((path) =>
  readFileSync(path, 'utf8').includes('/pagefind/pagefind.js'),
);
assert(
  eagerPagefindReferences.length === 0,
  `Pagefind must remain lazy: ${eagerPagefindReferences.join(', ')}`,
);

console.log(
  `homepage asset audit passed (${assets.length} assets, ${fontAssets.length} fonts, ${socialCards.length} social cards, ${pagefindFragments.length} search fragments)`,
);
