import { describe, expect, it } from 'vitest';
import { getFontPreloadLinks } from './font-preloads.ts';

describe('getFontPreloadLinks', () => {
  it('preloads only Latin fonts for English pages', () => {
    expect(getFontPreloadLinks('en')).toHaveLength(2);
    expect(getFontPreloadLinks('en')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ as: 'font', type: 'font/woff2' }),
      ]),
    );
  });

  it('preloads Latin and Korean fonts for Korean pages', () => {
    expect(getFontPreloadLinks('ko')).toHaveLength(4);
    expect(getFontPreloadLinks('ko-KR')).toHaveLength(4);
  });

  it('preloads Latin and Japanese fonts for Japanese pages', () => {
    expect(getFontPreloadLinks('ja')).toHaveLength(4);
    expect(getFontPreloadLinks('ja-JP')).toHaveLength(4);
  });

  it('marks every font preload as anonymous CORS', () => {
    expect(getFontPreloadLinks('en')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ crossOrigin: 'anonymous', rel: 'preload' }),
      ]),
    );
  });
});
