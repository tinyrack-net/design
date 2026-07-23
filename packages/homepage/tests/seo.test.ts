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
    expect(manifest.pages).toHaveLength(249);
    expect(new Set(manifest.pages.map((entry) => entry.contentKey)).size).toBe(83);
    expect(new Set(manifest.pages.map((entry) => entry.description)).size).toBe(
      manifest.pages.length,
    );
    expect(new Set(manifest.pages.map((entry) => entry.canonicalUrl)).size).toBe(
      manifest.pages.length,
    );

    for (const entry of manifest.pages) {
      expect(entry.description.length, entry.path).toBeGreaterThan(0);
      expect(entry.description.length, entry.path).toBeLessThanOrEqual(160);
      expect(entry.description, entry.path).not.toMatch(/(?:\.\.\.|…)\s*$/);
      expect(entry.canonicalUrl).toBe(`${manifest.site.url}${entry.canonicalPath}`);
      expect(entry.alternates).toHaveLength(3);
      expect(entry.alternates.map((alternate) => alternate.locale).sort()).toEqual([
        'en',
        'ja',
        'ko',
      ]);
      for (const alternate of entry.alternates) {
        const sibling = manifest.pages.find(
          (candidate) =>
            candidate.contentKey === entry.contentKey &&
            candidate.locale === alternate.locale,
        );
        expect(alternate).toEqual({
          language: expect.any(String),
          locale: sibling?.locale,
          path: sibling?.path,
          url: sibling?.canonicalUrl,
        });
      }
    }

    expect(
      manifest.pages.find((entry) => entry.path === '/en/components/button')
        ?.description,
    ).toBe(
      'Buttons for commands and form actions, with six intents, three appearances, and three sizes.',
    );
    expect(manifest.pages.find((entry) => entry.path === '/en')?.documentTitle).toBe(
      'Tinyrack Design System',
    );
    for (const locale of ['en', 'ko', 'ja']) {
      for (const contentKey of ['/foundations/logo', '/foundations/app-icons']) {
        expect(
          manifest.pages.find((entry) => entry.path === `/${locale}${contentKey}`),
        ).toEqual(
          expect.objectContaining({
            contentKey,
            section: 'brand',
          }),
        );
      }
    }
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
