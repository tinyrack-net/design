import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp, { type Metadata } from 'sharp';

const brandRoot = join(process.cwd(), 'src/brand');
const assetRoot = join(brandRoot, 'apps');
const products = ['tinest', 'dotweave', 'proxer', 'issuary'] as const;
const productSizes = [16, 32, 48, 128, 512] as const;
const launcherSizes = [512, 1024] as const;

/** Every numeric filename suffix is the rasterized height in pixels. Square
 *  artwork rasterizes to a matching width, so `-512` keeps the meaning it has
 *  always had; a lockup takes the width its own `viewBox` ratio implies. */
type RasterSource = {
  readonly heights: readonly number[];
  readonly name: string;
  readonly root: string;
};

const logoSources: readonly RasterSource[] = [
  { heights: [128, 256, 512], name: 'tinyrack-mark', root: brandRoot },
  { heights: [128, 256, 512], name: 'tinyrack-mark-inverse', root: brandRoot },
  /** 180 is what iOS wants for `apple-touch-icon`; 512 covers store and manifest
   *  use. 128 and 256 cover ordinary raster downloads. */
  { heights: [128, 180, 256, 512], name: 'tinyrack-app-icon', root: brandRoot },
  { heights: [64, 128, 256], name: 'tinyrack-lockup', root: brandRoot },
  { heights: [64, 128, 256], name: 'tinyrack-lockup-inverse', root: brandRoot },
  { heights: [64, 128, 256], name: 'tinyrack-lockup-ko', root: brandRoot },
  { heights: [64, 128, 256], name: 'tinyrack-lockup-ko-inverse', root: brandRoot },
];

const productSources: readonly RasterSource[] = products.map((product) => ({
  heights: productSizes,
  name: `${product}-app-icon`,
  root: assetRoot,
}));

type IconFamily = {
  readonly glyphBounds: readonly [number, number, number, number];
  readonly label: string;
  readonly name: string;
  readonly root: string;
  readonly sourceName: string;
  readonly sourceSize: number;
};

const iconFamilies: readonly IconFamily[] = [
  {
    glyphBounds: [11, 11, 37, 37],
    label: 'Tinyrack',
    name: 'tinyrack',
    root: brandRoot,
    sourceName: 'tinyrack-app-icon',
    sourceSize: 48,
  },
  {
    glyphBounds: [14.666667, 14.666667, 49.333333, 49.333333],
    label: 'Tinest',
    name: 'tinest',
    root: assetRoot,
    sourceName: 'tinest-app-icon',
    sourceSize: 64,
  },
  {
    glyphBounds: [14.666667, 14.666667, 49.333333, 49.333333],
    label: 'Dotweave',
    name: 'dotweave',
    root: assetRoot,
    sourceName: 'dotweave-app-icon',
    sourceSize: 64,
  },
  {
    glyphBounds: [14.666667, 12, 49.333333, 52],
    label: 'Proxer',
    name: 'proxer',
    root: assetRoot,
    sourceName: 'proxer-app-icon',
    sourceSize: 64,
  },
  {
    glyphBounds: [12, 14.666667, 52, 52],
    label: 'Issuary',
    name: 'issuary',
    root: assetRoot,
    sourceName: 'issuary-app-icon',
    sourceSize: 64,
  },
] as const;

const launcherSources: readonly RasterSource[] = iconFamilies.flatMap((family) =>
  ['launcher-icon', 'adaptive-foreground'].map((suffix) => ({
    heights: launcherSizes,
    name: `${family.name}-${suffix}`,
    root: family.root,
  })),
);

const checkOnly = process.argv.includes('--check');

function parseViewBox(svg: string): { height: number; width: number } {
  const declaration = /viewBox="([^"]+)"/.exec(svg)?.[1];
  const [, , width, height] = (declaration ?? '').trim().split(/\s+/).map(Number);
  if (!width || !height) {
    throw new Error(`Brand SVG has no usable viewBox: ${declaration ?? '(missing)'}`);
  }
  return { height, width };
}

function paths(svg: string): string[] {
  const matches = svg.match(/<path\b[^>]*\/>/g) ?? [];
  if (matches.length < 2) throw new Error('App icon must contain a tile and glyph');
  return matches;
}

function number(value: number): string {
  return Number(value.toFixed(6)).toString();
}

function launcherSvg(family: IconFamily, source: string): string {
  const scale = 48 / family.sourceSize;
  const transform =
    scale === 1 ? 'translate(8 8)' : `translate(8 8) scale(${number(scale)})`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-labelledby="${family.name}-launcher-icon-title ${family.name}-launcher-icon-description" data-safe-inset="8">
  <title id="${family.name}-launcher-icon-title">${family.label} launcher icon</title>
  <desc id="${family.name}-launcher-icon-description">${family.label} app icon centered with launcher-safe padding</desc>
  <g transform="${transform}">
    ${paths(source).join('\n    ')}
  </g>
</svg>
`;
}

function adaptiveForegroundSvg(family: IconFamily, source: string): string {
  const [left, top, right, bottom] = family.glyphBounds;
  const width = right - left;
  const height = bottom - top;
  const scale = 53 / Math.max(width, height);
  const centerX = (left + right) / 2;
  const centerY = (top + bottom) / 2;
  const transform = `translate(54 54) scale(${number(scale)}) translate(${number(-centerX)} ${number(-centerY)})`;
  const [, ...glyph] = paths(source);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108" role="img" aria-labelledby="${family.name}-adaptive-foreground-title ${family.name}-adaptive-foreground-description" data-safe-zone="27 27 54 54">
  <title id="${family.name}-adaptive-foreground-title">${family.label} adaptive icon foreground</title>
  <desc id="${family.name}-adaptive-foreground-description">${family.label} glyph centered inside the Android adaptive icon safe zone</desc>
  <g transform="${transform}">
    ${glyph.join('\n    ')}
  </g>
</svg>
`;
}

async function writeDerivedSvg(path: string, contents: string): Promise<void> {
  if (!checkOnly) {
    await writeFile(path, contents);
    return;
  }
  const existing = await readFile(path, 'utf8').catch(() => undefined);
  if (existing !== contents) throw new Error(`Generated SVG is stale: ${path}`);
}

async function rasterize(svg: Buffer, width: number, height: number): Promise<Buffer> {
  return sharp(svg, { density: 576 })
    .resize(width, height, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function rawPixels(image: Buffer | string): Promise<Buffer> {
  return sharp(image).ensureAlpha().raw().toBuffer();
}

async function assertRasterMatches(
  path: string,
  expected: Buffer,
  width: number,
  height: number,
): Promise<void> {
  if (!existsSync(path)) throw new Error(`Missing generated raster: ${path}`);

  const metadata: Metadata = await sharp(path).metadata();
  if (
    metadata.format !== 'png' ||
    metadata.width !== width ||
    metadata.height !== height
  ) {
    throw new Error(
      `Invalid generated raster metadata for ${path}: ${JSON.stringify(metadata)}`,
    );
  }

  const [actualPixels, expectedPixels] = await Promise.all([
    rawPixels(path),
    rawPixels(expected),
  ]);
  if (actualPixels.length !== expectedPixels.length) {
    throw new Error(`Generated raster pixel length changed: ${path}`);
  }

  let changedPixels = 0;
  for (let index = 0; index < actualPixels.length; index += 4) {
    let maximumDelta = 0;
    for (let channel = 0; channel < 4; channel += 1) {
      const actual = actualPixels[index + channel] ?? 0;
      const reference = expectedPixels[index + channel] ?? 0;
      maximumDelta = Math.max(maximumDelta, Math.abs(actual - reference));
    }
    if (maximumDelta > 8) changedPixels += 1;
  }

  const pixelCount = width * height;
  if (changedPixels / pixelCount > 0.005) {
    throw new Error(
      `Generated raster is stale: ${path} (${changedPixels}/${pixelCount} pixels changed)`,
    );
  }
}

async function writeRaster(
  path: string,
  expected: Buffer,
  width: number,
  height: number,
): Promise<void> {
  if (existsSync(path)) {
    try {
      await assertRasterMatches(path, expected, width, height);
      return;
    } catch {
      // Replace missing, malformed, or materially stale generated output.
    }
  }
  await writeFile(path, expected);
}

await mkdir(assetRoot, { recursive: true });

for (const family of iconFamilies) {
  const source = await readFile(join(family.root, `${family.sourceName}.svg`), 'utf8');
  await writeDerivedSvg(
    join(family.root, `${family.name}-launcher-icon.svg`),
    launcherSvg(family, source),
  );
  await writeDerivedSvg(
    join(family.root, `${family.name}-adaptive-foreground.svg`),
    adaptiveForegroundSvg(family, source),
  );
}

let total = 0;
for (const source of [...logoSources, ...productSources, ...launcherSources]) {
  const svg = await readFile(join(source.root, `${source.name}.svg`));
  const viewBox = parseViewBox(svg.toString('utf8'));

  for (const height of source.heights) {
    const width = Math.round((viewBox.width / viewBox.height) * height);
    const pngPath = join(source.root, `${source.name}-${height}.png`);
    const png = await rasterize(svg, width, height);
    if (checkOnly) await assertRasterMatches(pngPath, png, width, height);
    else await writeRaster(pngPath, png, width, height);
    total += 1;
  }
}

console.log(
  checkOnly ? `verified ${total} brand rasters` : `generated ${total} brand rasters`,
);
