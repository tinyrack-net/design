import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const brandRoot = join(process.cwd(), 'src/brand');
const assetRoot = join(brandRoot, 'apps');
const products = ['dotweave', 'proxer', 'tinyauth'] as const;
const productSizes = [16, 32, 48, 128, 512] as const;

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

const checkOnly = process.argv.includes('--check');

function parseViewBox(svg: string): { height: number; width: number } {
  const declaration = /viewBox="([^"]+)"/.exec(svg)?.[1];
  const [, , width, height] = (declaration ?? '').trim().split(/\s+/).map(Number);
  if (!width || !height) {
    throw new Error(`Brand SVG has no usable viewBox: ${declaration ?? '(missing)'}`);
  }
  return { height, width };
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

  const metadata: sharp.Metadata = await sharp(path).metadata();
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

await mkdir(assetRoot, { recursive: true });

let total = 0;
for (const source of [...logoSources, ...productSources]) {
  const svg = await readFile(join(source.root, `${source.name}.svg`));
  const viewBox = parseViewBox(svg.toString('utf8'));

  for (const height of source.heights) {
    const width = Math.round((viewBox.width / viewBox.height) * height);
    const pngPath = join(source.root, `${source.name}-${height}.png`);
    const png = await rasterize(svg, width, height);
    if (checkOnly) await assertRasterMatches(pngPath, png, width, height);
    else await writeFile(pngPath, png);
    total += 1;
  }
}

console.log(
  checkOnly ? `verified ${total} brand rasters` : `generated ${total} brand rasters`,
);
