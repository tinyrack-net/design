import { describe, expect, it } from 'vitest';
import { renderTinyrackAstroCode } from './astro-code.js';

describe('Astro MDX code renderer', () => {
  it('keeps inline code plain and decoded', async () => {
    const result = await renderTinyrackAstroCode({
      html: 'pnpm&nbsp;verify',
    });

    expect(result).toEqual({
      kind: 'inline',
      text: 'pnpm verify',
    });
  });

  it('renders supported fenced code as Shiki tokens for SSR', async () => {
    const result = await renderTinyrackAstroCode({
      className: 'language-ts',
      html: 'const answer = 1;',
    });

    expect(result.kind).toBe('block');
    if (result.kind !== 'block') {
      throw new Error('Expected block code render result.');
    }

    expect(result.language).toBe('ts');
    expect(result.text).toBe('const answer = 1;');
    expect(result.lines).not.toBeNull();
    expect(result.lines?.flat().some((token) => token.style?.includes('color'))).toBe(
      true,
    );
  });

  it('falls back to readable escaped plain text for unsupported languages', async () => {
    const result = await renderTinyrackAstroCode({
      className: 'language-not-a-language',
      html: '&lt;script /&gt;',
    });

    expect(result).toEqual({
      kind: 'block',
      language: 'not-a-language',
      lines: null,
      text: '<script />',
    });
  });
});
