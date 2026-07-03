import { DEFAULT_THEME, mergeMantineTheme } from '@mantine/core';
import { describe, expect, it } from 'vitest';
import { createTinyrackMantineTheme, tinyrackMantineTheme } from './index.js';

const tinyrackColorKey = 'tinyrack';
const darkColorKey = 'dark';

describe('tinyrack mantine theme', () => {
  it('maps shared tokens to a Mantine theme override', () => {
    const theme = createTinyrackMantineTheme();

    expect(theme.primaryColor).toBe('tinyrack');
    expect(theme.primaryShade).toEqual({ light: 8, dark: 0 });
    expect(theme.colors?.[tinyrackColorKey]).toHaveLength(10);
    expect(theme.colors?.[darkColorKey]?.[9]).toBe('#0a0a0a');
    expect(theme.colors?.[darkColorKey]?.[7]).toBe('#171717');
    expect(theme.fontFamily).toContain('var(--tinyrack-font-body)');
    expect(theme.headings?.fontFamily).toContain('var(--tinyrack-font-heading)');
    expect(theme.defaultRadius).toBe('sm');
    expect(theme.autoContrast).toBe(true);
  });

  it('exports a reusable singleton theme', () => {
    expect(tinyrackMantineTheme).toEqual(createTinyrackMantineTheme());
  });

  it('keeps tinyrack button variants readable on white backgrounds', () => {
    const theme = createTinyrackMantineTheme();
    const resolvedTheme = mergeMantineTheme(DEFAULT_THEME, theme);

    const whiteVariant = theme.variantColorResolver?.({
      autoContrast: theme.autoContrast ?? false,
      color: 'tinyrack',
      theme: resolvedTheme,
      variant: 'white',
    });

    expect(whiteVariant).toMatchObject({
      background: 'var(--mantine-color-white)',
      color: '#0a0a0a',
    });
  });
});
