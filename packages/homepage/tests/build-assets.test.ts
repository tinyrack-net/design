import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  docsHighlightDefaultThemes,
  docsHighlightLanguageGrammars,
  docsHighlightThemes,
  loadDocsManifest,
} from '@tinyrack/docs/config';
import { describe, it } from 'vitest';
import config from '../docs.config.ts';

const clientRoot = join(process.cwd(), 'build/client');
const docsManifest = loadDocsManifest(config, { root: process.cwd() });
const assetsRoot = join(clientRoot, 'assets');
const pagefindRoot = join(clientRoot, 'pagefind');
const assets = readdirSync(assetsRoot);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

describe('homepage build assets', () => {
  it('preserves the static deployment asset contract', () => {
    const fontAssets = assets.filter((asset) => /\.(?:woff2?|ttf)$/.test(asset));
    // Sans covers prose in three scripts; Mono covers code at two weights.
    const ibmPlexAsset =
      /^ibm-plex-(?:sans-(?:latin|kr-korean|jp-japanese)-(?:400|500|600|700)|mono-latin-(?:400|500))-normal-.+\.woff2?$/;

    assert(
      fontAssets.length === 28,
      `Expected 28 IBM Plex assets, got ${fontAssets.length}`,
    );
    assert(
      fontAssets.every((asset) => ibmPlexAsset.test(asset)),
      `Unexpected web font assets: ${fontAssets.filter((asset) => !ibmPlexAsset.test(asset)).join(', ')}`,
    );
    for (const weight of ['400', '500']) {
      assert(
        fontAssets.some((asset) => asset.startsWith(`ibm-plex-mono-latin-${weight}-`)),
        `Missing IBM Plex Mono Latin ${weight}`,
      );
    }
    for (const weight of ['400', '500', '600', '700']) {
      assert(
        fontAssets.some((asset) => asset.startsWith(`ibm-plex-sans-latin-${weight}-`)),
        `Missing IBM Plex Sans Latin ${weight}`,
      );
      assert(
        fontAssets.some((asset) =>
          asset.startsWith(`ibm-plex-sans-kr-korean-${weight}-`),
        ),
        `Missing IBM Plex Sans KR ${weight}`,
      );
      assert(
        fontAssets.some((asset) =>
          asset.startsWith(`ibm-plex-sans-jp-japanese-${weight}-`),
        ),
        `Missing IBM Plex Sans JP ${weight}`,
      );
    }

    for (const cssAsset of assets.filter((asset) => asset.endsWith('.css'))) {
      const css = readFileSync(join(assetsRoot, cssAsset), 'utf8');
      assert(
        !/@(?:custom-media|reference|theme|variant)\b/.test(css),
        `Uncompiled CSS directive in ${cssAsset}`,
      );
    }

    // Engine and bundle policy, independent of which languages the site enables:
    // TRCodeBlock ships no grammars of its own, and the docs highlighter uses the
    // JavaScript regex engine, so a broad Shiki bundle or any Oniguruma WASM
    // payload means something reintroduced a dependency on shiki/bundle/web.
    const forbiddenAssets = assets.filter((asset) =>
      /(?:bundle-web|wasm-|\.wasm$)/i.test(asset),
    );
    assert(
      forbiddenAssets.length === 0,
      `Forbidden broad Shiki assets: ${forbiddenAssets.join(', ')}`,
    );

    // Which grammars ship is derived from docs.config.ts rather than restated
    // here, so enabling a language is a one-line config change and this test
    // still proves that exactly the declared set was built.
    const chunkFor = (name: string) =>
      assets.find((candidate) =>
        new RegExp(`^${name}-[\\w-]{8}\\.js$`).test(candidate),
      );

    // Grammar chunks are identified by content, not by filename: a content page
    // named `mdx.mdx` produces a `mdx-<hash>.js` route chunk that is otherwise
    // indistinguishable from the `mdx` TextMate grammar.
    const grammarChunkFor = (grammar: string) => {
      const candidates = assets.filter(
        (candidate) =>
          new RegExp(`^${grammar}-[\\w-]{8}\\.js$`).test(candidate) &&
          readFileSync(join(assetsRoot, candidate), 'utf8').includes('scopeName'),
      );
      assert(
        candidates.length <= 1,
        `Ambiguous grammar chunk for ${grammar}: ${candidates.join(', ')}`,
      );
      return candidates[0];
    };

    const declaredLanguages = config.highlight?.languages ?? [];
    const declaredGrammars = [
      ...new Set(
        declaredLanguages.map((language) => docsHighlightLanguageGrammars[language]),
      ),
    ].sort();
    assert(
      declaredGrammars.length > 0,
      'docs.config.ts must declare highlight.languages',
    );

    const missingGrammars = declaredGrammars.filter(
      (grammar) => !grammarChunkFor(grammar),
    );
    assert(
      missingGrammars.length === 0,
      `Declared grammars missing a build chunk: ${missingGrammars.join(', ')}`,
    );

    const undeclaredGrammars = [
      ...new Set(Object.values(docsHighlightLanguageGrammars)),
    ].filter(
      (grammar) => !declaredGrammars.includes(grammar) && grammarChunkFor(grammar),
    );
    assert(
      undeclaredGrammars.length === 0,
      `Grammars built without being declared in docs.config.ts: ${undeclaredGrammars.join(', ')}`,
    );

    const selectedThemes = [
      ...new Set(Object.values(config.highlight?.themes ?? docsHighlightDefaultThemes)),
    ];
    const highlightAssets = [
      ...declaredGrammars.map((grammar) => grammarChunkFor(grammar) as string),
      ...selectedThemes.map((theme) => {
        const asset = chunkFor(theme);
        assert(asset !== undefined, `Missing theme chunk ${theme}`);
        return asset;
      }),
      (() => {
        const asset = chunkFor('docs-highlighter');
        assert(asset !== undefined, 'Missing docs-highlighter chunk');
        return asset;
      })(),
    ];
    const undeclaredThemes = docsHighlightThemes.filter(
      (theme) => !selectedThemes.includes(theme) && chunkFor(theme),
    );
    assert(
      undeclaredThemes.length === 0,
      `Themes built without being selected: ${undeclaredThemes.join(', ')}`,
    );

    // A grammar is self-contained today because Shiki loads embedded languages
    // lazily. If one starts inlining its embedded grammars the chunk balloons,
    // which this catches before the payload reaches users.
    const oversizedHighlightChunks = highlightAssets.filter(
      (asset) => statSync(join(assetsRoot, asset)).size > 250 * 1024,
    );
    assert(
      oversizedHighlightChunks.length === 0,
      `Highlight chunks exceed the 250 KB per-chunk budget: ${oversizedHighlightChunks.join(', ')}`,
    );

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
    const appIconAssetRoot = join(brandAssetRoot, 'apps');
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
    for (const product of ['dotweave', 'tinyauth']) {
      for (const asset of [
        `${product}-app-icon.svg`,
        ...[16, 32, 48, 128, 512].map((size) => `${product}-app-icon-${size}.png`),
      ]) {
        assert(
          existsSync(join(appIconAssetRoot, asset)),
          `Missing app icon asset: ${asset}`,
        );
      }
    }
    assert(existsSync(socialCardRoot), 'Missing generated social cards');
    assert(
      !existsSync(spaFallbackPath),
      'Unknown routes must use the noindex 404 page, not an indexable SPA fallback',
    );

    const sitemap = readFileSync(sitemapPath, 'utf8');
    assert(
      [...sitemap.matchAll(/<loc>/g)].length === docsManifest.pages.length,
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
      socialCards.length === docsManifest.pages.length,
      `Expected ${docsManifest.pages.length} social cards, got ${socialCards.length}`,
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
      assert(
        statSync(join(pagefindRoot, file)).isFile(),
        `Missing Pagefind asset ${file}`,
      );
    }
    const pagefindFragments = readdirSync(join(pagefindRoot, 'fragment')).filter(
      (file) => file.endsWith('.pf_fragment'),
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
  });
});
