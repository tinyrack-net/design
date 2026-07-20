import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const homepageRoot = process.cwd();
const brandRoot = join(homepageRoot, 'public/brand');
const brandAssets = [
  'tinyrack-mark.svg',
  'tinyrack-mark-inverse.svg',
  'tinyrack-lockup.svg',
  'tinyrack-lockup-inverse.svg',
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
  });

  it('keeps the approved mark, lockup, and compact icon proportions', () => {
    expect(readBrandAsset('tinyrack-mark.svg')).toContain('viewBox="0 0 32 32"');
    expect(readBrandAsset('tinyrack-lockup.svg')).toContain('viewBox="0 0 156 38"');
    expect(readBrandAsset('tinyrack-app-icon.svg')).toContain('viewBox="0 0 48 48"');
    expect(pathGeometry(readBrandAsset('tinyrack-lockup.svg'))).toHaveLength(2);
  });

  it('documents the logo contract and every stable download URL', () => {
    const logo = readFileSync(
      join(homepageRoot, 'app/content/en/foundations/logo.mdx'),
      'utf8',
    );
    expect(logo).toContain('title: "Logo"');
    expect(logo).toContain('one quarter of the mark height');
    expect(logo).toContain('<TRCode>16px</TRCode>');
    expect(logo).toContain('<TRCode>112px</TRCode>');
    for (const asset of brandAssets) {
      expect(logo).toContain(`href="/brand/${asset}"`);
      expect(logo).toContain(`download="${asset}"`);
    }
  });
});
