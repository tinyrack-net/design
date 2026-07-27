import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const homepageRoot = process.cwd();
const brandRoot = join(homepageRoot, 'public/brand');
/** Source of truth: the artwork ships from @tinyrack/ui, and public/brand is a
 *  synced copy so the documentation can link to stable URLs. */
const packageBrandRoot = join(homepageRoot, '../ui/src/brand');
const brandAssets = [
  'tinyrack-mark.svg',
  'tinyrack-mark-inverse.svg',
  'tinyrack-lockup.svg',
  'tinyrack-lockup-inverse.svg',
  'tinyrack-lockup-ko.svg',
  'tinyrack-lockup-ko-inverse.svg',
  'tinyrack-app-icon.svg',
] as const;
const approvedColors = new Set(['#0a0a0a', '#fafafa']);

function readBrandAsset(name: (typeof brandAssets)[number]) {
  return readFileSync(join(brandRoot, name), 'utf8');
}

function pathGeometry(svg: string) {
  return [...svg.matchAll(/<path\b([^>]*)\bd="([^"]+)"([^>]*)\/?\s*>/g)].map(
    ([, before, path, after]) => ({
      path,
      transform: `${before}${after}`.match(/\btransform="([^"]+)"/)?.[1] ?? '',
    }),
  );
}

describe('Tinyrack logo system', () => {
  it('publishes the complete digital SVG asset set', () => {
    for (const asset of brandAssets) {
      expect(existsSync(join(brandRoot, asset)), asset).toBe(true);
    }
  });

  it('keeps every asset self-contained, outlined, and achromatic', () => {
    for (const asset of brandAssets) {
      const svg = readBrandAsset(asset);
      expect(svg, asset).toContain('<svg');
      expect(svg, asset).toContain('<path');
      expect(svg, asset).not.toMatch(/<(?:text|image|style|script)\b/);
      expect(svg, asset).not.toContain('var(--');
      expect(svg, asset).not.toMatch(/\b(?:href|src)=/);

      const colors = [...svg.matchAll(/#[\da-fA-F]{6}/g)].map(([color]) =>
        color.toLowerCase(),
      );
      expect(colors.length, asset).toBeGreaterThan(0);
      expect(
        colors.every((color) => approvedColors.has(color)),
        asset,
      ).toBe(true);
    }
  });

  it('uses identical geometry for the primary and inverse artwork', () => {
    expect(pathGeometry(readBrandAsset('tinyrack-mark.svg'))).toEqual(
      pathGeometry(readBrandAsset('tinyrack-mark-inverse.svg')),
    );
    expect(pathGeometry(readBrandAsset('tinyrack-lockup.svg'))).toEqual(
      pathGeometry(readBrandAsset('tinyrack-lockup-inverse.svg')),
    );
    expect(pathGeometry(readBrandAsset('tinyrack-lockup-ko.svg'))).toEqual(
      pathGeometry(readBrandAsset('tinyrack-lockup-ko-inverse.svg')),
    );
  });

  it('serves artwork identical to the copy published from @tinyrack/ui', () => {
    for (const asset of brandAssets) {
      expect(readFileSync(join(packageBrandRoot, asset), 'utf8'), asset).toBe(
        readBrandAsset(asset),
      );
    }
  });

  it('keeps the approved mark, lockup, and compact icon proportions', () => {
    expect(readBrandAsset('tinyrack-mark.svg')).toContain('viewBox="0 0 32 32"');
    expect(readBrandAsset('tinyrack-lockup.svg')).toContain('viewBox="0 0 156 38"');
    expect(readBrandAsset('tinyrack-app-icon.svg')).toContain('viewBox="0 0 48 48"');
    expect(pathGeometry(readBrandAsset('tinyrack-lockup.svg'))).toHaveLength(2);
  });

  it('builds the Korean lockup on the shared lockup grid', () => {
    // The Korean wordmark is wider or narrower than the Latin one depending on
    // its glyphs, so only the height and the mark placement are fixed.
    for (const asset of [
      'tinyrack-lockup-ko.svg',
      'tinyrack-lockup-ko-inverse.svg',
    ] as const) {
      const svg = readBrandAsset(asset);
      expect(svg, asset).toMatch(/viewBox="0 0 [\d.]+ 38"/);
      const paths = pathGeometry(svg);
      expect(paths, asset).toHaveLength(2);
      expect(paths[0]?.transform, asset).toBe('translate(3 3)');
    }
    // The mark must be the same artwork, not a redrawn one.
    expect(pathGeometry(readBrandAsset('tinyrack-lockup-ko.svg'))[0]?.path).toBe(
      pathGeometry(readBrandAsset('tinyrack-mark.svg'))[0]?.path,
    );
  });

  it('documents the logo contract and every stable download URL', () => {
    for (const locale of ['en', 'ko', 'ja']) {
      const logo = readFileSync(
        join(homepageRoot, `app/content/${locale}/foundations/logo.mdx`),
        'utf8',
      );
      expect(logo, locale).toContain('section: brand');
      expect(logo, locale).toContain('order: 0');
      expect(logo, locale).toContain('<TRCode>16px</TRCode>');
      expect(logo, locale).toContain('<TRCode>112px</TRCode>');
      expect(logo.indexOf('data-logo-minimum-size'), locale).toBeLessThan(
        logo.indexOf('## Anatomy') >= 0
          ? logo.indexOf('## Anatomy')
          : logo.indexOf('## 형태와 구성') >= 0
            ? logo.indexOf('## 형태와 구성')
            : logo.indexOf('## 形状と構成'),
      );
      expect(logo, locale).not.toContain('TRSwitch to');
      expect(logo, locale).toContain("from '@tinyrack/ui/brand/tinyrack-lockup.svg'");
      for (const asset of brandAssets) {
        expect(logo, locale).toContain(`href="/brand/${asset}"`);
        expect(logo, locale).toContain(`download="${asset}"`);
      }
    }
  });
});
