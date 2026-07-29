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
});
