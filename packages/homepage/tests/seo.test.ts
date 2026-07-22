import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadDocsManifest } from '@tinyrack/docs/config';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import config from '../docs.config.js';

const homepageRoot = process.cwd();
const buildRoot = join(homepageRoot, 'build/client');
const manifest = loadDocsManifest(config, { root: homepageRoot });

describe('automatic homepage SEO', () => {
  it('derives unique metadata from every frontmatter document', () => {
    expect(manifest.pages).toHaveLength(231);
    expect(new Set(manifest.pages.map((entry) => entry.description)).size).toBe(
      manifest.pages.length,
    );
    expect(new Set(manifest.pages.map((entry) => entry.canonicalUrl)).size).toBe(
      manifest.pages.length,
    );

    for (const entry of manifest.pages) {
      expect(entry.description.length, entry.path).toBeGreaterThan(0);
      expect(entry.description.length, entry.path).toBeLessThanOrEqual(160);
      expect(entry.canonicalUrl).toBe(`${manifest.site.url}${entry.canonicalPath}`);
    }

    expect(
      manifest.pages.find((entry) => entry.path === '/en/components/button')
        ?.description,
    ).toBe(
      'Commands and form actions with six semantic intents, three visual treatments, and three densities.',
    );
    expect(manifest.pages.find((entry) => entry.path === '/en')?.documentTitle).toBe(
      'Tinyrack UI',
    );
  });

  it('emits a canonical sitemap and explicit crawler policy', () => {
    const sitemap = readFileSync(join(buildRoot, 'sitemap.xml'), 'utf8');
    const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
      (match) => match[1],
    );
    expect(locations).toEqual(manifest.pages.map((entry) => entry.canonicalUrl));
    expect(sitemap).not.toContain('<lastmod>');

    expect(readFileSync(join(buildRoot, 'robots.txt'), 'utf8')).toBe(
      `User-agent: *\nAllow: /\n\nSitemap: ${manifest.site.url}/sitemap.xml\n`,
    );
  });

  it('emits one 1200 by 630 social card per document', async () => {
    for (const entry of manifest.pages) {
      const imagePath = join(buildRoot, entry.imagePath.replace(/^\//, ''));
      expect(existsSync(imagePath), entry.imagePath).toBe(true);
      const metadata = await sharp(imagePath).metadata();
      expect(metadata.width, entry.imagePath).toBe(1200);
      expect(metadata.height, entry.imagePath).toBe(630);
      expect(metadata.format, entry.imagePath).toBe('png');
    }
  });
});
