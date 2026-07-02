import { describe, expect, it } from 'vitest';
import { createTinyrackMantineTheme, tinyrackMantineTheme } from '../index.js';

describe('tinyrack mantine theme', () => {
  it('maps shared tokens to a Mantine theme override', () => {
    const theme = createTinyrackMantineTheme();

    expect(theme.primaryColor).toBe('tinyrack');
    expect(theme.primaryShade).toEqual({ light: 7, dark: 4 });
    expect(theme.colors?.tinyrack).toHaveLength(10);
    expect(theme.colors?.dark?.[9]).toBe('#050506');
    expect(theme.colors?.dark?.[7]).toBe('#0b0d12');
    expect(theme.fontFamily).toContain('var(--tinyrack-font-body)');
    expect(theme.headings?.fontFamily).toContain('var(--tinyrack-font-heading)');
    expect(theme.defaultRadius).toBe('md');
  });

  it('exports a reusable singleton theme', () => {
    expect(tinyrackMantineTheme).toEqual(createTinyrackMantineTheme());
  });
});
