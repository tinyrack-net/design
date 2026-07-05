import { DEFAULT_THEME, mergeMantineTheme } from '@mantine/core';
import { describe, expect, it } from 'vitest';
import { createTinyrackMantineTheme, tinyrackMantineTheme } from './index.js';

const tinyrackColorKey = 'tinyrack';
const darkColorKey = 'dark';
const tinyrackFilledTextVariable = 'var(--tinyrack-mantine-filled-color)';

type ComponentVars = Record<string, Record<string, string> | undefined> & {
  root?: Record<string, string>;
};

function componentRootVar(
  theme: ReturnType<typeof createTinyrackMantineTheme>,
  componentName: string,
  cssVariable: string,
  props: Record<string, unknown> = {},
) {
  const vars = theme.components?.[componentName]?.vars?.({}, props) as
    | ComponentVars
    | undefined;

  return vars?.root?.[cssVariable];
}

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
    expect(theme.spacing?.md).toBe('0.75rem');
    expect(theme.spacing?.['2xl']).toBe('2rem');
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

  it('keeps Mantine primary filled fallback components on scheme-aware text', () => {
    const theme = createTinyrackMantineTheme();

    expect(componentRootVar(theme, 'Badge', '--badge-color')).toBe(
      tinyrackFilledTextVariable,
    );
    expect(componentRootVar(theme, 'Chip', '--chip-color')).toBe(
      tinyrackFilledTextVariable,
    );
    expect(componentRootVar(theme, 'Pagination', '--pagination-active-color')).toBe(
      tinyrackFilledTextVariable,
    );
    expect(componentRootVar(theme, 'ThemeIcon', '--ti-color')).toBe(
      tinyrackFilledTextVariable,
    );
    expect(componentRootVar(theme, 'SegmentedControl', '--sc-color')).toBe(
      'var(--mantine-primary-color-filled)',
    );
    expect(componentRootVar(theme, 'SegmentedControl', '--sc-label-color')).toBe(
      tinyrackFilledTextVariable,
    );
  });

  it('does not override non-tinyrack filled component text colors', () => {
    const theme = createTinyrackMantineTheme();

    expect(
      componentRootVar(theme, 'Badge', '--badge-color', {
        color: 'red',
        variant: 'filled',
      }),
    ).toBeUndefined();
    expect(
      componentRootVar(theme, 'Pagination', '--pagination-active-color', {
        color: 'blue',
      }),
    ).toBeUndefined();
    expect(
      componentRootVar(theme, 'SegmentedControl', '--sc-label-color', {
        color: 'blue',
      }),
    ).toBeUndefined();
  });
});
