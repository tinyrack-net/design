import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import {
  canonicalDocumentPath,
  staticDocumentRoutes,
} from '../app/content/shared/static-document-routes.js';
import {
  createDocumentMeta,
  documentSiteUrl,
  findDocumentSeoEntry,
} from '../app/seo/document-seo.js';
import { createDocumentSeoManifest } from '../scripts/create-document-seo.js';

const homepageRoot = process.cwd();
const buildRoot = join(homepageRoot, 'build/client');
const manifest = createDocumentSeoManifest(homepageRoot);

describe('automatic homepage SEO', () => {
  it('derives unique metadata from every static document', () => {
    expect(manifest).toHaveLength(staticDocumentRoutes.length);
    expect(new Set(manifest.map((entry) => entry.description)).size).toBe(
      manifest.length,
    );
    expect(new Set(manifest.map((entry) => entry.canonicalUrl)).size).toBe(
      manifest.length,
    );

    for (const entry of manifest) {
      expect(entry.description.length, entry.path).toBeGreaterThan(0);
      expect(entry.description.length, entry.path).toBeLessThanOrEqual(160);
      expect(entry.canonicalPath).toBe(canonicalDocumentPath(entry.path));
      expect(entry.canonicalUrl).toBe(`${documentSiteUrl}${entry.canonicalPath}`);
    }

    expect(findDocumentSeoEntry('/components/button/', manifest)?.description).toBe(
      'Commands and form actions with three levels of intent, three visual treatments, and three densities.',
    );
    expect(findDocumentSeoEntry('/', manifest)?.documentTitle).toBe('Tinyrack UI');
  });

  it('returns complete page metadata and noindexes unknown routes', () => {
    const buttonMeta = createDocumentMeta('/components/button/', manifest);
    expect(buttonMeta).toContainEqual({ title: 'Button · Tinyrack UI' });
    expect(buttonMeta).toContainEqual({
      href: 'https://design.tinyrack.net/components/button/',
      rel: 'canonical',
      tagName: 'link',
    });
    expect(buttonMeta).toContainEqual({
      content: 'https://design.tinyrack.net/og/components/button.png',
      property: 'og:image',
    });
    expect(buttonMeta.some((descriptor) => 'script:ld+json' in descriptor)).toBe(true);

    expect(createDocumentMeta('/missing', manifest)).toContainEqual({
      content: 'noindex,nofollow',
      name: 'robots',
    });
  });

  it('emits a canonical sitemap and explicit crawler policy', () => {
    const sitemap = readFileSync(join(buildRoot, 'sitemap.xml'), 'utf8');
    const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
      (match) => match[1],
    );
    expect(locations).toEqual(manifest.map((entry) => entry.canonicalUrl));
    expect(sitemap).not.toContain('<lastmod>');

    expect(readFileSync(join(buildRoot, 'robots.txt'), 'utf8')).toBe(
      `User-agent: *\nAllow: /\n\nSitemap: ${documentSiteUrl}/sitemap.xml\n`,
    );
  });

  it('emits one 1200 by 630 social card per document', async () => {
    for (const entry of manifest) {
      const imagePath = join(buildRoot, entry.imagePath.replace(/^\//, ''));
      expect(existsSync(imagePath), entry.imagePath).toBe(true);
      const metadata = await sharp(imagePath).metadata();
      expect(metadata.width, entry.imagePath).toBe(1200);
      expect(metadata.height, entry.imagePath).toBe(630);
      expect(metadata.format, entry.imagePath).toBe('png');
    }
  });
});
