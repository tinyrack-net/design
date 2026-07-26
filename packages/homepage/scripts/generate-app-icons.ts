import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const assetRoot = join(process.cwd(), 'public/brand/apps');
/** Tinyrack's own icon lives with the published brand artwork, not with the
 *  product icons, so consumers get it from the package. */
const brandRoot = join(process.cwd(), '../ui/src/brand');
const products = ['dotweave', 'tinyauth'] as const;
const sizes = [16, 32, 48, 128, 512] as const;
/** 180 is what iOS wants for `apple-touch-icon`; 512 covers store and manifest
 *  use. The SVG serves every other surface. */
const tinyrackSizes = [180, 512] as const;
const checkOnly = process.argv.includes('--check');

async function rasterize(svg: Buffer, size: number): Promise<Buffer> {
  return sharp(svg, { density: 576 })
    .resize(size, size, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function rawPixels(image: Buffer | string): Promise<Buffer> {
  return sharp(image).ensureAlpha().raw().toBuffer();
}

async function assertRasterMatches(
  path: string,
  expected: Buffer,
  size: number,
): Promise<void> {
  if (!existsSync(path)) throw new Error(`Missing generated app icon: ${path}`);

  const metadata: sharp.Metadata = await sharp(path).metadata();
  if (
    metadata.format !== 'png' ||
    metadata.width !== size ||
    metadata.height !== size
  ) {
    throw new Error(
      `Invalid generated app icon metadata for ${path}: ${JSON.stringify(metadata)}`,
    );
  }

  const [actualPixels, expectedPixels] = await Promise.all([
    rawPixels(path),
    rawPixels(expected),
  ]);
  if (actualPixels.length !== expectedPixels.length) {
    throw new Error(`Generated app icon pixel length changed: ${path}`);
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

  const pixelCount = size * size;
  if (changedPixels / pixelCount > 0.005) {
    throw new Error(
      `Generated app icon is stale: ${path} (${changedPixels}/${pixelCount} pixels changed)`,
    );
  }
}

await mkdir(assetRoot, { recursive: true });

for (const product of products) {
  const svgPath = join(assetRoot, `${product}-app-icon.svg`);
  const svg = await readFile(svgPath);

  for (const size of sizes) {
    const pngPath = join(assetRoot, `${product}-app-icon-${size}.png`);
    const png = await rasterize(svg, size);
    if (checkOnly) await assertRasterMatches(pngPath, png, size);
    else await writeFile(pngPath, png);
  }
}

const tinyrackSvg = await readFile(join(brandRoot, 'tinyrack-app-icon.svg'));
for (const size of tinyrackSizes) {
  const pngPath = join(brandRoot, `tinyrack-app-icon-${size}.png`);
  const png = await rasterize(tinyrackSvg, size);
  if (checkOnly) await assertRasterMatches(pngPath, png, size);
  else await writeFile(pngPath, png);
}

const total = products.length * sizes.length + tinyrackSizes.length;
console.log(
  checkOnly ? `verified ${total} generated app icons` : `generated ${total} app icons`,
);
