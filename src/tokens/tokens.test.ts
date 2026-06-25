import { describe, expect, it } from 'vitest';
import { tinyrackSemanticColors, tinyrackTokens } from './index.js';

const cssColorPattern = /^(#[0-9a-f]{6}|#[0-9a-f]{8}|var\(--[a-z0-9-]+\))$/i;

describe('tinyrack design tokens', () => {
  it('provides required light and dark semantic colors', () => {
    for (const mode of ['light', 'dark'] as const) {
      expect(tinyrackSemanticColors[mode]).toMatchObject({
        background: expect.any(String),
        surface: expect.any(String),
        text: expect.any(String),
        border: expect.any(String),
        focus: expect.any(String),
        primary: expect.any(String),
        secondary: expect.any(String),
        success: expect.any(String),
        warning: expect.any(String),
        error: expect.any(String),
        info: expect.any(String),
      });
    }
  });

  it('uses valid css color values', () => {
    for (const semanticColors of Object.values(tinyrackSemanticColors)) {
      for (const color of Object.values(semanticColors)) {
        expect(color).toMatch(cssColorPattern);
      }
    }
  });

  it('keeps shared tokens library-agnostic', () => {
    const serialized = JSON.stringify(tinyrackTokens).toLowerCase();
    expect(serialized).not.toContain('mantine');
    expect(serialized).not.toContain('daisy');
    expect(serialized).not.toContain('starlight');
  });
});
