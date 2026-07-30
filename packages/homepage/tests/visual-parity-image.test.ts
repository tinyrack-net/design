import { describe, expect, it } from 'vitest';
import { compareParityImages } from './visual-parity-image.ts';

function solid(width: number, height: number, rgba: readonly number[]) {
  return Uint8Array.from(Array.from({ length: width * height }, () => rgba).flat());
}

describe('visual parity image comparison', () => {
  it('accepts identical images', () => {
    const image = solid(4, 4, [255, 255, 255, 255]);
    expect(compareParityImages(image, image, 4, 4)).toMatchObject({
      antialiasedPixels: 0,
      mismatchedPixels: 0,
      structuralPixels: 0,
    });
  });

  it('classifies a rasterization fringe next to an edge as antialiasing', () => {
    const react = solid(7, 7, [255, 255, 255, 255]);
    const flutter = react.slice();
    for (let y = 1; y < 6; y += 1) {
      for (let x = 2; x < 5; x += 1) {
        const offset = (y * 7 + x) * 4;
        react.set([0, 0, 0, 255], offset);
        flutter.set(x === 2 ? [32, 32, 32, 255] : [0, 0, 0, 255], offset);
      }
    }

    expect(compareParityImages(react, flutter, 7, 7)).toMatchObject({
      structuralPixels: 0,
    });
  });

  it('classifies a locally displaced glyph endpoint as antialiasing', () => {
    const react = solid(9, 9, [255, 255, 255, 255]);
    const flutter = react.slice();
    for (let y = 2; y < 7; y += 1) {
      react.set([20, 20, 20, 255], (y * 9 + 4) * 4);
      flutter.set([20, 20, 20, 255], (y * 9 + 4) * 4);
    }
    for (let y = 3; y < 6; y += 1) {
      react.set([20, 20, 20, 255], (y * 9 + 2) * 4);
      flutter.set([20, 20, 20, 255], (y * 9 + 2) * 4);
    }
    react.set([20, 20, 20, 255], (1 * 9 + 4) * 4);
    flutter.set([20, 20, 20, 255], (7 * 9 + 4) * 4);

    expect(compareParityImages(react, flutter, 9, 9)).toMatchObject({
      structuralPixels: 0,
    });
  });

  it('rejects a color difference in a flat region', () => {
    const react = solid(9, 9, [255, 255, 255, 255]);
    const flutter = solid(9, 9, [220, 220, 220, 255]);
    expect(compareParityImages(react, flutter, 9, 9).structuralPixels).toBeGreaterThan(
      0,
    );
  });

  it('rejects a wrong solid edge color instead of treating it as antialiasing', () => {
    const react = solid(9, 9, [255, 255, 255, 255]);
    const flutter = react.slice();
    for (let y = 1; y < 8; y += 1) {
      for (let x = 2; x < 7; x += 1) {
        react.set([20, 20, 20, 255], (y * 9 + x) * 4);
        flutter.set([90, 90, 90, 255], (y * 9 + x) * 4);
      }
    }
    expect(compareParityImages(react, flutter, 9, 9).structuralPixels).toBeGreaterThan(
      0,
    );
  });

  it('rejects a one-pixel translation instead of treating both edges as antialiasing', () => {
    const react = solid(11, 11, [255, 255, 255, 255]);
    const flutter = react.slice();
    for (let y = 2; y < 8; y += 1) {
      for (let x = 2; x < 9; x += 1) {
        react.set([29, 78, 216, 255], (y * 11 + x) * 4);
        flutter.set([29, 78, 216, 255], ((y + 1) * 11 + x) * 4);
      }
    }

    expect(
      compareParityImages(react, flutter, 11, 11).structuralPixels,
    ).toBeGreaterThan(0);
  });

  it('rejects a missing focus ring', () => {
    const react = solid(13, 13, [255, 255, 255, 255]);
    const flutter = react.slice();
    for (let x = 2; x < 11; x += 1) {
      react.set([37, 99, 235, 255], (2 * 13 + x) * 4);
      react.set([37, 99, 235, 255], (10 * 13 + x) * 4);
    }
    for (let y = 2; y < 11; y += 1) {
      react.set([37, 99, 235, 255], (y * 13 + 2) * 4);
      react.set([37, 99, 235, 255], (y * 13 + 10) * 4);
    }

    expect(
      compareParityImages(react, flutter, 13, 13).structuralPixels,
    ).toBeGreaterThan(0);
  });

  it('rejects a wrong intermediate transition color', () => {
    const react = solid(9, 9, [29, 70, 196, 255]);
    const flutter = solid(9, 9, [29, 73, 204, 255]);

    expect(compareParityImages(react, flutter, 9, 9).structuralPixels).toBeGreaterThan(
      0,
    );
  });
});
