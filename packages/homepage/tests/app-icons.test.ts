import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

const homepageRoot = process.cwd();
const assetRoot = join(homepageRoot, 'public/brand/apps');
const products = ['dotweave', 'tinyauth'] as const;
const sizes = [16, 32, 48, 128, 512] as const;
const approvedColors = {
  dotweave: new Set(['#0a0a0a', '#2dd4bf', '#fafafa']),
  tinyauth: new Set(['#0a0a0a', '#38bdf8', '#fafafa']),
} as const;

function numbers(value: string | undefined) {
  return value?.split(' ').map(Number) ?? [];
}

function readSvg(product: (typeof products)[number]) {
  return readFileSync(join(assetRoot, `${product}-app-icon.svg`), 'utf8');
}

function attribute(svg: string, name: string) {
  return svg.match(new RegExp(`${name}="([^"]+)"`))?.[1];
}

describe('Tinyrack app icon system', () => {
  it('publishes self-contained SVG masters on one shared geometry grid', () => {
    const tinyrack = readFileSync(
      join(homepageRoot, 'public/brand/tinyrack-app-icon.svg'),
      'utf8',
    );
    const geometry = products.map((product) => {
      const svg = readSvg(product);
      expect(svg).toContain('viewBox="0 0 64 64"');
      expect(svg).toContain(`<title id="${product}-app-icon-title">`);
      expect(svg).toContain(`<desc id="${product}-app-icon-description">`);
      expect(svg).not.toMatch(/<(?:text|image|style|script|linearGradient|filter)\b/);
      expect(svg).not.toContain('var(--');
      expect(svg).not.toMatch(/\b(?:href|src)=/);

      const colors = [...svg.matchAll(/#[\da-fA-F]{6}/g)].map(([color]) =>
        color.toLowerCase(),
      );
      expect(colors.length).toBeGreaterThan(0);
      expect(
        colors.every((color) => approvedColors[product].has(color)),
        product,
      ).toBe(true);

      return {
        bounds: attribute(svg, 'data-row-bounds'),
        height: attribute(svg, 'data-row-height'),
        starts: attribute(svg, 'data-row-starts'),
        tile: svg.match(/<path fill="#0a0a0a" d="([^"]+)"/)?.[1],
      };
    });

    expect(geometry[0]).toEqual(geometry[1]);
    expect(geometry[0]).toMatchObject({
      bounds: '14.666667 49.333333',
      height: '8',
      starts: '14.666667 28 41.333333',
    });

    const scale = 64 / 48;
    const sourceStarts = numbers(attribute(tinyrack, 'data-row-starts'));
    const sourceBounds = numbers(attribute(tinyrack, 'data-row-bounds'));
    const appStarts = numbers(geometry[0]?.starts);
    const appBounds = numbers(geometry[0]?.bounds);
    for (const [index, value] of appStarts.entries()) {
      expect(value).toBeCloseTo((sourceStarts[index] ?? 0) * scale, 5);
    }
    for (const [index, value] of appBounds.entries()) {
      expect(value).toBeCloseTo((sourceBounds[index] ?? 0) * scale, 5);
    }
    expect(Number(geometry[0]?.height)).toBe(
      Number(attribute(tinyrack, 'data-row-height')) * scale,
    );
  });

  it('publishes every PNG derivative at its declared pixel size', async () => {
    for (const product of products) {
      for (const size of sizes) {
        const path = join(assetRoot, `${product}-app-icon-${size}.png`);
        expect(existsSync(path), path).toBe(true);
        const metadata = await sharp(path).metadata();
        expect(metadata.format, path).toBe('png');
        expect(metadata.width, path).toBe(size);
        expect(metadata.height, path).toBe(size);
        expect(metadata.hasAlpha, path).toBe(true);
      }
    }
  });

  it('documents every stable app icon download URL', () => {
    const docs = readFileSync(
      join(homepageRoot, 'app/content/en/foundations/app-icons.mdx'),
      'utf8',
    );

    expect(docs).toContain('title: "App icons"');
    expect(docs).toContain('## Shared construction');
    expect(docs).toContain('src="/brand/tinyrack-app-icon.svg"');
    expect(docs).toContain('data-app-icon-construction');
    for (const product of products) {
      const svg = `${product}-app-icon.svg`;
      expect(docs).toContain(`href="/brand/apps/${svg}"`);
      expect(docs).toContain(`download="${svg}"`);
      for (const size of sizes) {
        const png = `${product}-app-icon-${size}.png`;
        expect(docs).toContain(`href="/brand/apps/${png}"`);
        expect(docs).toContain(`download="${png}"`);
      }
    }
  });
});
