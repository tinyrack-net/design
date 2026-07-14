import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { componentDocsManifest } from '../app/content/shared/component-docs-manifest.js';
import {
  canonicalDocumentPath,
  staticDocumentRoutes,
} from '../app/content/shared/static-document-routes.js';
import { createDocumentSeoManifest } from '../scripts/create-document-seo.js';

const buildRoot = join(process.cwd(), 'build/client');
const documentSeoManifest = createDocumentSeoManifest(process.cwd());

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
  it('pre-renders every known content route with metadata and a route chunk', () => {
    const assets = readdirSync(join(buildRoot, 'assets'));
    expect(staticDocumentRoutes).toHaveLength(63);
    for (const route of staticDocumentRoutes) {
      const seo = documentSeoManifest.find((entry) => entry.path === route.path);
      expect(seo, route.path).toBeDefined();
      const path = htmlPathFor(route.path);
      expect(path, route.path).toBeDefined();
      const html = readFileSync(path as string, 'utf8');
      expect(html, route.path).toContain(`<title>${seo?.documentTitle}</title>`);
      expect(html, route.path).toContain('name="description"');
      expect(html, route.path).toContain(
        `<link href="${seo?.canonicalUrl}" rel="canonical"/>`,
      );
      expect(html, route.path).toContain(
        `<meta content="${seo?.imageUrl}" property="og:image"/>`,
      );
      expect(html, route.path).toContain('name="twitter:card"');
      expect(html, route.path).toContain('type="application/ld+json"');
      expect(html, route.path).toContain(
        'href="https://github.com/tinyrack-net/themes/releases.atom"',
      );
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
    const home = readFileSync(htmlPathFor('/') as string, 'utf8');
    for (const entry of componentDocsManifest) {
      expect(home).not.toContain(`${entry.id}.docs-`);
    }
  });

  it('pre-renders adjacent document navigation in sidebar order', () => {
    for (const [index, route] of staticDocumentRoutes.entries()) {
      const html = readFileSync(htmlPathFor(route.path) as string, 'utf8');
      const previousRoute = staticDocumentRoutes[index - 1];
      const nextRoute = staticDocumentRoutes[index + 1];
      const links = html.match(/data-document-pagination-link="(?:previous|next)"/g);

      expect(html, route.path).toContain('aria-label="Previous and next documents"');
      expect(html, route.path).toContain('data-pagefind-ignore="all"');
      expect(links, route.path).toHaveLength(
        Number(previousRoute !== undefined) + Number(nextRoute !== undefined),
      );

      if (previousRoute !== undefined) {
        expect(html, route.path).toContain(
          `aria-label="Previous document: ${previousRoute.title}"`,
        );
        expect(html, route.path).toContain(
          `href="${canonicalDocumentPath(previousRoute.path)}"`,
        );
      }
      if (nextRoute !== undefined) {
        expect(html, route.path).toContain(
          `aria-label="Next document: ${nextRoute.title}"`,
        );
        expect(html, route.path).toContain(
          `href="${canonicalDocumentPath(nextRoute.path)}"`,
        );
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
