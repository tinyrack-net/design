import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const assetRoot = join(process.cwd(), 'public/brand/apps');
const products = ['dotweave', 'tinyauth'];
const sizes = [16, 32, 48, 128, 512];
const checkOnly = process.argv.includes('--check');

async function rasterize(svg, size) {
  return sharp(svg, { density: 576 })
    .resize(size, size, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function rawPixels(image) {
  return sharp(image).ensureAlpha().raw().toBuffer();
}

async function assertRasterMatches(path, expected, size) {
  if (!existsSync(path)) throw new Error(`Missing generated app icon: ${path}`);

  const metadata = await sharp(path).metadata();
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
      maximumDelta = Math.max(
        maximumDelta,
        Math.abs(actualPixels[index + channel] - expectedPixels[index + channel]),
      );
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

console.log(
  checkOnly
    ? `verified ${products.length * sizes.length} generated app icons`
    : `generated ${products.length * sizes.length} app icons`,
);
