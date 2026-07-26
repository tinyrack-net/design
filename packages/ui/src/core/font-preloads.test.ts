import { describe, expect, it } from 'vitest';
import { createTinyrackFontPreloadLinks } from './font-preloads.ts';

const files = {
  japanese: ['japanese-400.woff2', 'japanese-700.woff2'],
  korean: ['korean-400.woff2', 'korean-700.woff2'],
  latin: ['latin-400.woff2', 'latin-700.woff2'],
} as const;

describe('createTinyrackFontPreloadLinks', () => {
  it('always includes the Latin fonts', () => {
    expect(createTinyrackFontPreloadLinks('en', files)).toEqual([
      {
        as: 'font',
        crossOrigin: 'anonymous',
        href: 'latin-400.woff2',
        rel: 'preload',
        type: 'font/woff2',
      },
      {
        as: 'font',
        crossOrigin: 'anonymous',
        href: 'latin-700.woff2',
        rel: 'preload',
        type: 'font/woff2',
      },
    ]);
  });

  it('adds only the matching CJK subset', () => {
    expect(
      createTinyrackFontPreloadLinks('ko-KR', files).map(({ href }) => href),
    ).toEqual([
      'latin-400.woff2',
      'latin-700.woff2',
      'korean-400.woff2',
      'korean-700.woff2',
    ]);
    expect(
      createTinyrackFontPreloadLinks('ja-JP', files).map(({ href }) => href),
    ).toEqual([
      'latin-400.woff2',
      'latin-700.woff2',
      'japanese-400.woff2',
      'japanese-700.woff2',
    ]);
  });
});
