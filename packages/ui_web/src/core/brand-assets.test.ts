import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import packageJson from '../../package.json' with { type: 'json' };

const brandRoot = resolve(import.meta.dirname, '../brand');
const products = ['dotweave', 'proxer', 'tinyauth'] as const;
const productSizes = [16, 32, 48, 128, 512] as const;
/** Each entry is a raster height in pixels; square artwork rasterizes to a
 *  matching width, and a lockup takes the width its `viewBox` ratio implies. */
const logoRasters = {
  'tinyrack-app-icon': [128, 180, 256, 512],
  'tinyrack-lockup': [64, 128, 256],
  'tinyrack-lockup-inverse': [64, 128, 256],
  'tinyrack-lockup-ko': [64, 128, 256],
  'tinyrack-lockup-ko-inverse': [64, 128, 256],
  'tinyrack-mark': [128, 256, 512],
  'tinyrack-mark-inverse': [128, 256, 512],
} as const;
const expectedAssets = [
  'tinyrack-app-icon.svg',
  'tinyrack-lockup-inverse.svg',
  'tinyrack-lockup-ko-inverse.svg',
  'tinyrack-lockup-ko.svg',
  'tinyrack-lockup.svg',
  'tinyrack-mark-inverse.svg',
  'tinyrack-mark.svg',
  ...Object.entries(logoRasters).flatMap(([name, heights]) =>
    heights.map((height) => `${name}-${height}.png`),
  ),
  ...products.flatMap((product) => [
    `apps/${product}-app-icon-128.png`,
    `apps/${product}-app-icon-16.png`,
    `apps/${product}-app-icon-32.png`,
    `apps/${product}-app-icon-48.png`,
    `apps/${product}-app-icon-512.png`,
    `apps/${product}-app-icon.svg`,
  ]),
].sort();

function listFiles(root: string): string[] {
  return readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) =>
      relative(root, resolve(entry.parentPath, entry.name)).replaceAll('\\', '/'),
    )
    .sort();
}

function rasterWidth(svgPath: string, height: number) {
  const viewBox = /viewBox="([^"]+)"/.exec(readFileSync(svgPath, 'utf8'))?.[1];
  const [, , boxWidth, boxHeight] = (viewBox ?? '').trim().split(/\s+/).map(Number);
  expect(boxWidth, svgPath).toBeGreaterThan(0);
  expect(boxHeight, svgPath).toBeGreaterThan(0);
  return Math.round(((boxWidth ?? 0) / (boxHeight ?? 1)) * height);
}

async function rasterize(svgPath: string, width: number, height: number) {
  return sharp(readFileSync(svgPath), { density: 576 })
    .resize(width, height, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer();
}

async function expectGeneratedPng(svgPath: string, pngPath: string, size: number) {
  const width = rasterWidth(svgPath, size);
  const image = sharp(pngPath);
  const metadata = await image.metadata();
  expect(metadata, pngPath).toMatchObject({
    format: 'png',
    height: size,
    width,
  });

  const [actual, expected] = await Promise.all([
    image.ensureAlpha().raw().toBuffer(),
    rasterize(svgPath, width, size),
  ]);
  expect(actual.length, pngPath).toBe(expected.length);

  let changedPixels = 0;
  for (let index = 0; index < actual.length; index += 4) {
    let maximumDelta = 0;
    for (let channel = 0; channel < 4; channel += 1) {
      maximumDelta = Math.max(
        maximumDelta,
        Math.abs((actual[index + channel] ?? 0) - (expected[index + channel] ?? 0)),
      );
    }
    if (maximumDelta > 8) changedPixels += 1;
  }
  expect(changedPixels / (width * size), pngPath).toBeLessThanOrEqual(0.005);
}

describe('@tinyrack/ui brand assets', () => {
  it('publishes the complete, exact artwork catalog', () => {
    expect(listFiles(brandRoot)).toEqual(expectedAssets);
  });

  it('keeps every SVG self-contained', () => {
    for (const asset of expectedAssets.filter((name) => name.endsWith('.svg'))) {
      const svg = readFileSync(join(brandRoot, asset), 'utf8');
      expect(svg, asset).toContain('<svg');
      expect(svg, asset).toContain('<path');
      expect(svg, asset).not.toMatch(/<(?:text|image|style|script)\b/);
      expect(svg, asset).not.toContain('var(--');
      expect(svg, asset).not.toMatch(/\b(?:href|src)=/);
    }
  });

  it('keeps every committed PNG synchronized with its SVG master', async () => {
    for (const [name, heights] of Object.entries(logoRasters)) {
      const svg = join(brandRoot, `${name}.svg`);
      for (const height of heights) {
        await expectGeneratedPng(svg, join(brandRoot, `${name}-${height}.png`), height);
      }
    }

    for (const product of products) {
      const svg = join(brandRoot, 'apps', `${product}-app-icon.svg`);
      for (const size of productSizes) {
        await expectGeneratedPng(
          svg,
          join(brandRoot, 'apps', `${product}-app-icon-${size}.png`),
          size,
        );
      }
    }
  });

  it('maps top-level and nested artwork through the source and published exports', () => {
    expect(packageJson.exports['./brand/*']).toEqual({
      '@tinyrack/source': './src/brand/*',
      default: './dist/brand/*',
    });
    expect(packageJson.publishConfig.exports['./brand/*']).toBe('./dist/brand/*');
    expect(expectedAssets).toContain('tinyrack-mark.svg');
    expect(expectedAssets).toContain('tinyrack-lockup-ko-256.png');
    expect(expectedAssets).toContain('apps/proxer-app-icon-512.png');
  });
});
