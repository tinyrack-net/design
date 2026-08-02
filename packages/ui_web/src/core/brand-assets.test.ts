import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import packageJson from '../../package.json' with { type: 'json' };

const brandRoot = resolve(import.meta.dirname, '../brand');
const products = ['dotweave', 'proxer', 'tinyauth'] as const;
const productSizes = [16, 32, 48, 128, 512] as const;
const tinyrackSizes = [180, 512] as const;
const expectedAssets = [
  'tinyrack-app-icon-180.png',
  'tinyrack-app-icon-512.png',
  'tinyrack-app-icon.svg',
  'tinyrack-lockup-inverse.svg',
  'tinyrack-lockup-ko-inverse.svg',
  'tinyrack-lockup-ko.svg',
  'tinyrack-lockup.svg',
  'tinyrack-mark-inverse.svg',
  'tinyrack-mark.svg',
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

async function rasterize(svgPath: string, size: number) {
  return sharp(readFileSync(svgPath), { density: 576 })
    .resize(size, size, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer();
}

async function expectGeneratedPng(svgPath: string, pngPath: string, size: number) {
  const image = sharp(pngPath);
  const metadata = await image.metadata();
  expect(metadata, pngPath).toMatchObject({
    format: 'png',
    height: size,
    width: size,
  });

  const [actual, expected] = await Promise.all([
    image.ensureAlpha().raw().toBuffer(),
    rasterize(svgPath, size),
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
  expect(changedPixels / (size * size), pngPath).toBeLessThanOrEqual(0.005);
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
    const tinyrackSvg = join(brandRoot, 'tinyrack-app-icon.svg');
    for (const size of tinyrackSizes) {
      await expectGeneratedPng(
        tinyrackSvg,
        join(brandRoot, `tinyrack-app-icon-${size}.png`),
        size,
      );
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
    expect(expectedAssets).toContain('apps/proxer-app-icon-512.png');
  });
});
