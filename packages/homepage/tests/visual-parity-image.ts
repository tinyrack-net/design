import pixelmatch from 'pixelmatch';

type ImageComparison = {
  antialiasedPixels: number;
  diff: Buffer;
  mismatchedPixels: number;
  structuralSamples: Array<{
    flutter: Rgb;
    react: Rgb;
    x: number;
    y: number;
  }>;
  structuralPixels: number;
};

type Rgb = readonly [number, number, number];

function rgbAt(image: Uint8Array, pixel: number): Rgb {
  const offset = pixel * 4;
  return [image[offset] ?? 0, image[offset + 1] ?? 0, image[offset + 2] ?? 0];
}

function channelDistance(left: Rgb, right: Rgb) {
  return Math.max(
    Math.abs(left[0] - right[0]),
    Math.abs(left[1] - right[1]),
    Math.abs(left[2] - right[2]),
  );
}

function isBlendOf(color: Rgb, start: Rgb, end: Rgb) {
  const vector = [end[0] - start[0], end[1] - start[1], end[2] - start[2]] as const;
  const lengthSquared = vector.reduce((sum, channel) => sum + channel * channel, 0);
  if (lengthSquared === 0) return false;
  const offset = [
    color[0] - start[0],
    color[1] - start[1],
    color[2] - start[2],
  ] as const;
  const position = Math.max(
    0,
    Math.min(
      1,
      offset.reduce((sum, channel, index) => sum + channel * (vector[index] ?? 0), 0) /
        lengthSquared,
    ),
  );
  const projected = start.map(
    (channel, index) => channel + (vector[index] ?? 0) * position,
  ) as unknown as Rgb;
  return channelDistance(color, projected) <= 12;
}

function isCrossRasterAntialiasing(
  react: Uint8Array,
  flutter: Uint8Array,
  pixel: number,
  width: number,
  height: number,
) {
  const x = pixel % width;
  const y = Math.floor(pixel / width);
  const sharedEndpoints: Rgb[] = [];

  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const nextX = x + dx;
      const nextY = y + dy;
      if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) continue;
      const nextPixel = nextY * width + nextX;
      const reactColor = rgbAt(react, nextPixel);
      const flutterColor = rgbAt(flutter, nextPixel);
      if (channelDistance(reactColor, flutterColor) > 12) continue;
      const endpoint = reactColor.map(
        (channel, index) => (channel + (flutterColor[index] ?? 0)) / 2,
      ) as unknown as Rgb;
      if (
        sharedEndpoints.every((candidate) => channelDistance(candidate, endpoint) > 8)
      ) {
        sharedEndpoints.push(endpoint);
      }
    }
  }

  const reactColor = rgbAt(react, pixel);
  const flutterColor = rgbAt(flutter, pixel);
  for (let left = 0; left < sharedEndpoints.length; left += 1) {
    for (let right = left + 1; right < sharedEndpoints.length; right += 1) {
      const start = sharedEndpoints[left];
      const end = sharedEndpoints[right];
      if (
        start !== undefined &&
        end !== undefined &&
        channelDistance(start, end) > 24 &&
        isBlendOf(reactColor, start, end) &&
        isBlendOf(flutterColor, start, end)
      ) {
        return true;
      }
    }
  }
  return false;
}

function isShiftedRasterAntialiasing(
  react: Uint8Array,
  flutter: Uint8Array,
  pixel: number,
  width: number,
  height: number,
) {
  const x = pixel % width;
  const y = Math.floor(pixel / width);
  const reactNeighborhood: Rgb[] = [];
  const flutterNeighborhood: Rgb[] = [];
  for (let dy = -3; dy <= 3; dy += 1) {
    for (let dx = -3; dx <= 3; dx += 1) {
      const nextX = x + dx;
      const nextY = y + dy;
      if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) continue;
      const nextPixel = nextY * width + nextX;
      reactNeighborhood.push(rgbAt(react, nextPixel));
      flutterNeighborhood.push(rgbAt(flutter, nextPixel));
    }
  }

  const sharedEndpoints: Rgb[] = [];
  for (const reactEndpoint of reactNeighborhood) {
    const flutterEndpoint = flutterNeighborhood.find(
      (candidate) => channelDistance(reactEndpoint, candidate) <= 12,
    );
    if (flutterEndpoint === undefined) continue;
    const endpoint = reactEndpoint.map(
      (channel, index) => (channel + (flutterEndpoint[index] ?? 0)) / 2,
    ) as unknown as Rgb;
    if (
      sharedEndpoints.every((candidate) => channelDistance(candidate, endpoint) > 8)
    ) {
      sharedEndpoints.push(endpoint);
    }
  }

  const reactColor = rgbAt(react, pixel);
  const flutterColor = rgbAt(flutter, pixel);
  for (let left = 0; left < sharedEndpoints.length; left += 1) {
    for (let right = left + 1; right < sharedEndpoints.length; right += 1) {
      const start = sharedEndpoints[left];
      const end = sharedEndpoints[right];
      if (
        start !== undefined &&
        end !== undefined &&
        channelDistance(start, end) > 24 &&
        isBlendOf(reactColor, start, end) &&
        isBlendOf(flutterColor, start, end)
      ) {
        return true;
      }
    }
  }
  return false;
}

function isEdgePixel(image: Uint8Array, pixel: number, width: number, height: number) {
  const x = pixel % width;
  const y = Math.floor(pixel / width);
  const color = rgbAt(image, pixel);
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      if (dx === 0 && dy === 0) continue;
      const nextX = x + dx;
      const nextY = y + dy;
      if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) continue;
      if (channelDistance(color, rgbAt(image, nextY * width + nextX)) > 8) {
        return true;
      }
    }
  }
  return false;
}

export function compareParityImages(
  react: Uint8Array,
  flutter: Uint8Array,
  width: number,
  height: number,
): ImageComparison {
  const diff = Buffer.alloc(width * height * 4);
  const mismatchedPixels = pixelmatch(react, flutter, diff, width, height, {
    diffMask: true,
    includeAA: false,
    threshold: 0.1,
  });
  const mismatchesIncludingAntialiasing = pixelmatch(
    react,
    flutter,
    undefined,
    width,
    height,
    {
      includeAA: true,
      threshold: 0.1,
    },
  );
  let crossRasterAntialiasedPixels = 0;
  let structuralPixels = 0;
  const structuralSamples: ImageComparison['structuralSamples'] = [];
  for (let pixel = 0; pixel < width * height; pixel += 1) {
    if (diff[pixel * 4 + 3] === 0) continue;
    if (
      isCrossRasterAntialiasing(react, flutter, pixel, width, height) ||
      (isEdgePixel(react, pixel, width, height) &&
        isEdgePixel(flutter, pixel, width, height)) ||
      isShiftedRasterAntialiasing(react, flutter, pixel, width, height)
    ) {
      crossRasterAntialiasedPixels += 1;
      diff[pixel * 4] = 255;
      diff[pixel * 4 + 1] = 191;
      diff[pixel * 4 + 2] = 0;
    } else {
      structuralPixels += 1;
      if (structuralSamples.length < 20) {
        structuralSamples.push({
          flutter: rgbAt(flutter, pixel),
          react: rgbAt(react, pixel),
          x: pixel % width,
          y: Math.floor(pixel / width),
        });
      }
    }
  }

  return {
    antialiasedPixels:
      mismatchesIncludingAntialiasing - mismatchedPixels + crossRasterAntialiasedPixels,
    diff,
    mismatchedPixels,
    structuralSamples,
    structuralPixels,
  };
}
