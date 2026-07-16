import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { canonicalDocumentPath, loadDocsManifest } from '@tinyrack/docs/config';
import { describe, expect, it } from 'vitest';
import { componentDocsManifest } from '../app/content/shared/component-docs-manifest.js';
import config from '../docs.config.js';

const buildRoot = join(process.cwd(), 'build/client');
const buildMetadataPath = join(process.cwd(), 'build/tinyrack-docs.json');
const staticDocumentRoutes = loadDocsManifest(config, {
  root: process.cwd(),
}).pages;

function htmlPathFor(route: string) {
  if (route === '/') return join(buildRoot, 'index.html');
  const clean = route.replace(/^\//, '');
  const candidates = [
    join(buildRoot, clean, 'index.html'),
    join(buildRoot, `${clean}.html`),
  ];
  return candidates.find((path) => existsSync(path));
}

describe('static documentation output', () => {
  it('redirects the site root to the default locale homepage', () => {
    const metadata = JSON.parse(readFileSync(buildMetadataPath, 'utf8')) as {
      redirects?: Record<string, string>;
    };

    expect(metadata.redirects?.['index.html']).toContain('content="0;url=/en/"');
    expect(readFileSync(join(buildRoot, 'index.html'), 'utf8')).toContain(
      'http-equiv="refresh"',
    );
    expect(readFileSync(join(buildRoot, 'index.html'), 'utf8')).toContain(
      'content="0;url=/en/"',
    );
  });

  it('pre-renders every known content route with metadata and a route chunk', () => {
    const assets = readdirSync(join(buildRoot, 'assets'));
    expect(staticDocumentRoutes).toHaveLength(222);
    for (const route of staticDocumentRoutes) {
      const path = htmlPathFor(route.path);
      expect(path, route.path).toBeDefined();
      const html = readFileSync(path as string, 'utf8');
      expect(html, route.path).toContain(`<title>${route.documentTitle}</title>`);
      expect(html, route.path).toContain('name="description"');
      expect(html, route.path).toContain(
        `<link href="${route.canonicalUrl}" rel="canonical"/>`,
      );
      expect(html, route.path).toContain(
        `<meta content="${route.imageUrl}" property="og:image"/>`,
      );
      expect(html, route.path).toContain('name="twitter:card"');
      expect(html, route.path).toContain('type="application/ld+json"');
      expect(html, route.path).toMatch(new RegExp(`<h1[^>]*>${route.title}</h1>`));
      expect(
        assets.some(
          (asset) => asset.startsWith(`${route.moduleStem}-`) && asset.endsWith('.js'),
        ),
        `${route.path} must own a client route chunk`,
      ).toBe(true);
    }
  });

  it('does not eager-load component documentation from the homepage', () => {
    const home = readFileSync(htmlPathFor('/en') as string, 'utf8');
    for (const entry of componentDocsManifest) {
      expect(home).not.toContain(`${entry.id}.docs-`);
    }
  });

  it('pre-renders adjacent document navigation in sidebar order', () => {
    const locales = [...new Set(staticDocumentRoutes.map((route) => route.locale))];
    const paginationLabels = {
      en: { next: 'Next document', previous: 'Previous document' },
      ko: { next: '다음 문서', previous: '이전 문서' },
      ja: { next: '次のドキュメント', previous: '前のドキュメント' },
    } as const;
    for (const locale of locales) {
      const navigableRoutes = staticDocumentRoutes.filter(
        (route) =>
          route.locale === locale && route.layout === 'docs' && route.navigation,
      );
      for (const [index, route] of navigableRoutes.entries()) {
        const html = readFileSync(htmlPathFor(route.path) as string, 'utf8');
        const previousRoute = navigableRoutes[index - 1];
        const nextRoute = navigableRoutes[index + 1];
        const links = html.match(/data-document-pagination-link="(?:previous|next)"/g);

        expect(html, route.path).toContain('aria-label="Previous and next documents"');
        expect(html, route.path).toContain('data-pagefind-ignore="all"');
        expect(links, route.path).toHaveLength(
          Number(previousRoute !== undefined) + Number(nextRoute !== undefined),
        );

        if (previousRoute !== undefined) {
          expect(html, route.path).toContain(
            `aria-label="${paginationLabels[locale as keyof typeof paginationLabels].previous}: ${previousRoute.title}"`,
          );
          expect(html, route.path).toContain(
            `href="${canonicalDocumentPath(previousRoute.path)}"`,
          );
        }
        if (nextRoute !== undefined) {
          expect(html, route.path).toContain(
            `aria-label="${paginationLabels[locale as keyof typeof paginationLabels].next}: ${nextRoute.title}"`,
          );
          expect(html, route.path).toContain(
            `href="${canonicalDocumentPath(nextRoute.path)}"`,
          );
        }
      }
    }
  });

  it('publishes a static 404 page for Cloudflare Assets', () => {
    expect(existsSync(join(buildRoot, '404.html'))).toBe(true);
    expect(readFileSync(join(buildRoot, '404.html'), 'utf8')).toContain(
      'content="noindex,nofollow"',
    );
  });

  it('publishes one scoped Pagefind fragment for every documentation route', () => {
    const pagefindRoot = join(buildRoot, 'pagefind');
    expect(existsSync(join(pagefindRoot, 'pagefind-entry.json'))).toBe(true);
    expect(existsSync(join(pagefindRoot, 'pagefind.js'))).toBe(true);
    expect(existsSync(join(pagefindRoot, 'pagefind-worker.js'))).toBe(true);
    expect(existsSync(join(pagefindRoot, 'wasm.en.pagefind'))).toBe(true);
    expect(
      readdirSync(join(pagefindRoot, 'fragment')).filter((file) =>
        file.endsWith('.pf_fragment'),
      ),
    ).toHaveLength(staticDocumentRoutes.length);
    expect(
      readdirSync(join(pagefindRoot, 'index')).filter((file) =>
        file.endsWith('.pf_index'),
      ).length,
    ).toBeGreaterThan(0);

    for (const route of staticDocumentRoutes) {
      const html = readFileSync(htmlPathFor(route.path) as string, 'utf8');
      expect(html, route.path).toContain('data-pagefind-body=""');
    }
  });
});
