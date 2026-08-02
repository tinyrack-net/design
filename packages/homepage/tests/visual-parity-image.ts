import pixelmatch from 'pixelmatch';

export type ImageComparison = {
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

export type ComparisonOptions = {
  geometry?: {
    contentHeight: number;
    contentWidth: number;
    heightDelta: number;
    margin: number;
    widthDelta: number;
  };
  rasterRects?: Array<{
    bottom: number;
    left: number;
    right: number;
    top: number;
  }>;
};

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
  return channelDistance(color, projected) <= 48;
}

const imagePaletteCache = new WeakMap<Uint8Array, Set<number>>();

function colorKey(red: number, green: number, blue: number) {
  return (red << 16) | (green << 8) | blue;
}

function imagePalette(image: Uint8Array) {
  const cached = imagePaletteCache.get(image);
  if (cached !== undefined) return cached;
  const palette = new Set<number>();
  for (let pixel = 0; pixel < image.length / 4; pixel += 1) {
    const [red, green, blue] = rgbAt(image, pixel);
    palette.add(colorKey(red, green, blue));
  }
  imagePaletteCache.set(image, palette);
  return palette;
}

function imageContainsColor(image: Uint8Array, color: Rgb) {
  const palette = imagePalette(image);
  for (
    let red = Math.max(0, color[0] - 2);
    red <= Math.min(255, color[0] + 2);
    red += 1
  ) {
    for (
      let green = Math.max(0, color[1] - 2);
      green <= Math.min(255, color[1] + 2);
      green += 1
    ) {
      for (
        let blue = Math.max(0, color[2] - 2);
        blue <= Math.min(255, color[2] + 2);
        blue += 1
      ) {
        if (palette.has(colorKey(red, green, blue))) return true;
      }
    }
  }
  return false;
}

function sharedPalette(react: Uint8Array, flutter: Uint8Array) {
  const counts = (image: Uint8Array) => {
    const result = new Map<string, { color: Rgb; count: number }>();
    for (let pixel = 0; pixel < image.length / 4; pixel += 1) {
      const color = rgbAt(image, pixel);
      const key = color.join(',');
      const entry = result.get(key);
      if (entry === undefined) result.set(key, { color, count: 1 });
      else entry.count += 1;
    }
    return result;
  };
  const reactCounts = counts(react);
  const flutterCounts = counts(flutter);
  return [...reactCounts.entries()]
    .flatMap(([key, entry]) => {
      const flutterEntry = flutterCounts.get(key);
      return flutterEntry !== undefined && entry.count >= 4 && flutterEntry.count >= 4
        ? [{ color: entry.color, count: Math.min(entry.count, flutterEntry.count) }]
        : [];
    })
    .sort((left, right) => right.count - left.count)
    .slice(0, 32)
    .map(({ color }) => color);
}

function isSharedPaletteBlend(left: Rgb, right: Rgb, palette: Rgb[]) {
  for (let startIndex = 0; startIndex < palette.length; startIndex += 1) {
    for (let endIndex = startIndex + 1; endIndex < palette.length; endIndex += 1) {
      const start = palette[startIndex];
      const end = palette[endIndex];
      if (
        start !== undefined &&
        end !== undefined &&
        channelDistance(start, end) > 24 &&
        isBlendOf(left, start, end) &&
        isBlendOf(right, start, end)
      ) {
        return true;
      }
    }
  }
  return false;
}

function isExactOnePixelTranslation(
  react: Uint8Array,
  flutter: Uint8Array,
  width: number,
  height: number,
) {
  if (react.every((channel, index) => channel === flutter[index])) return false;
  return [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ].some(([dx = 0, dy = 0]) => {
    for (let y = Math.max(0, -dy); y < Math.min(height, height - dy); y += 1) {
      for (let x = Math.max(0, -dx); x < Math.min(width, width - dx); x += 1) {
        const reactPixel = y * width + x;
        const flutterPixel = (y + dy) * width + x + dx;
        if (
          channelDistance(rgbAt(react, reactPixel), rgbAt(flutter, flutterPixel)) > 0
        ) {
          return false;
        }
      }
    }
    return true;
  });
}

function isCrossRasterAntialiasing(
  react: Uint8Array,
  flutter: Uint8Array,
  pixel: number,
  width: number,
  height: number,
  palette: Rgb[],
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
  if (isSharedPaletteBlend(reactColor, flutterColor, palette)) return true;
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
  palette: Rgb[],
) {
  const x = pixel % width;
  const y = Math.floor(pixel / width);
  const reactNeighborhood: Rgb[] = [];
  const flutterNeighborhood: Rgb[] = [];
  for (let dy = -5; dy <= 5; dy += 1) {
    for (let dx = -5; dx <= 5; dx += 1) {
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
  if (isSharedPaletteBlend(reactColor, flutterColor, palette)) return true;
  const displacedSharedEndpoints =
    channelDistance(reactColor, flutterColor) > 24 &&
    (reactNeighborhood.some(
      (candidate) => channelDistance(candidate, flutterColor) <= 2,
    ) ||
      imageContainsColor(react, flutterColor)) &&
    (flutterNeighborhood.some(
      (candidate) => channelDistance(candidate, reactColor) <= 2,
    ) ||
      imageContainsColor(flutter, reactColor));
  if (displacedSharedEndpoints) return true;
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

function isLocallyFlat(
  image: Uint8Array,
  pixel: number,
  width: number,
  height: number,
) {
  const x = pixel % width;
  const y = Math.floor(pixel / width);
  const color = rgbAt(image, pixel);
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      const nextX = x + dx;
      const nextY = y + dy;
      if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) continue;
      if (channelDistance(color, rgbAt(image, nextY * width + nextX)) > 2) {
        return false;
      }
    }
  }
  return true;
}

export function compareParityImages(
  react: Uint8Array,
  flutter: Uint8Array,
  width: number,
  height: number,
  options: ComparisonOptions = {},
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
  const palette = sharedPalette(react, flutter);
  let structuralPixels = isExactOnePixelTranslation(react, flutter, width, height)
    ? 1
    : 0;
  const structuralSamples: ImageComparison['structuralSamples'] = [];
  for (let pixel = 0; pixel < width * height; pixel += 1) {
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    const rasterDifference =
      options.rasterRects?.some(
        (rect) =>
          x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom,
      ) ?? false;
    const geometry = options.geometry;
    const permittedGeometryFringe =
      geometry !== undefined &&
      ((geometry.widthDelta > 0 &&
        Math.abs(x - (geometry.margin + geometry.contentWidth)) <= 2) ||
        (geometry.heightDelta > 0 &&
          Math.abs(y - (geometry.margin + geometry.contentHeight)) <= 2));
    const reactColor = rgbAt(react, pixel);
    const flutterColor = rgbAt(flutter, pixel);
    const locallyFlatMismatch =
      channelDistance(reactColor, flutterColor) > 2 &&
      isLocallyFlat(react, pixel, width, height) &&
      isLocallyFlat(flutter, pixel, width, height);
    const boundedFlatPaletteBlend =
      channelDistance(reactColor, flutterColor) <= 8 &&
      isSharedPaletteBlend(reactColor, flutterColor, palette);
    const flatColorMismatch =
      locallyFlatMismatch &&
      !boundedFlatPaletteBlend &&
      !(
        imageContainsColor(react, flutterColor) ||
        imageContainsColor(flutter, reactColor)
      );
    if (flatColorMismatch && diff[pixel * 4 + 3] === 0) {
      diff[pixel * 4] = 255;
      diff[pixel * 4 + 1] = 0;
      diff[pixel * 4 + 2] = 0;
      diff[pixel * 4 + 3] = 255;
    }
    if (diff[pixel * 4 + 3] === 0) continue;
    if (permittedGeometryFringe || rasterDifference) {
      crossRasterAntialiasedPixels += 1;
      diff[pixel * 4] = 255;
      diff[pixel * 4 + 1] = 191;
      diff[pixel * 4 + 2] = 0;
      continue;
    }
    if (
      (!flatColorMismatch &&
        isCrossRasterAntialiasing(react, flutter, pixel, width, height, palette)) ||
      (!flatColorMismatch &&
        isShiftedRasterAntialiasing(react, flutter, pixel, width, height, palette))
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
          x,
          y,
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
