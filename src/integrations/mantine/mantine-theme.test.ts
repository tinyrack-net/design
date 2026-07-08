import { DEFAULT_THEME, mergeMantineTheme } from '@mantine/core';
import { describe, expect, it } from 'vitest';
import {
  createTinyrackMantineTheme,
  tinyrackMantineTheme,
} from '../../exports/mantine.js';

const tinyrackColorKey = 'tinyrack';
const darkColorKey = 'dark';
const tinyrackFilledTextVariable = 'var(--tinyrack-mantine-filled-color)';
const semanticColorKeys = ['success', 'warning', 'error', 'info'] as const;

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

function componentDefaultProp(
  theme: ReturnType<typeof createTinyrackMantineTheme>,
  componentName: string,
  propName: string,
) {
  return (theme.components?.[componentName]?.defaultProps as Record<string, unknown>)?.[
    propName
  ];
}

describe('tinyrack mantine theme', () => {
  it('maps shared tokens to a Mantine theme override', () => {
    const theme = createTinyrackMantineTheme();
    const semanticColorScale = (colorKey: (typeof semanticColorKeys)[number]) =>
      theme.colors?.[colorKey];

    expect(theme.primaryColor).toBe('tinyrack');
    expect(theme.colors?.[tinyrackColorKey]).toHaveLength(10);
    for (const colorKey of semanticColorKeys) {
      expect(semanticColorScale(colorKey)).toHaveLength(10);
    }
    expect(semanticColorScale('success')?.[0]).toBe('#22c55e');
    expect(semanticColorScale('success')?.[9]).toBe('#15803d');
    expect(semanticColorScale('warning')?.[0]).toBe('#eab308');
    expect(semanticColorScale('warning')?.[9]).toBe('#a16207');
    expect(semanticColorScale('error')?.[0]).toBe('#f87171');
    expect(semanticColorScale('error')?.[9]).toBe('#dc2626');
    expect(semanticColorScale('info')?.[0]).toBe('#d4d4d4');
    expect(semanticColorScale('info')?.[9]).toBe('#404040');
    expect(theme.colors?.[darkColorKey]?.[9]).toBe('#0a0a0a');
    expect(theme.colors?.[darkColorKey]?.[7]).toBe('#171717');
    expect(theme.fontFamily).toContain('var(--tinyrack-font-body)');
    expect(theme.fontFamilyMonospace).toContain('var(--tinyrack-font-mono)');
    expect(theme.headings?.fontFamily).toContain('var(--tinyrack-font-heading)');
    expect(theme.headings?.textWrap).toBe('balance');
    expect(theme.headings?.sizes?.h1).toMatchObject({
      fontSize: '2.25rem',
      lineHeight: '1.2',
    });
    expect(theme.fontSizes?.md).toBe('1rem');
    expect(theme.fontSizes?.['2xs']).toBe('0.6875rem');
    expect(theme.lineHeights?.lg).toBe('1.65');
    expect(theme.defaultRadius).toBe('sm');
    expect(theme.spacing?.md).toBe('0.75rem');
    expect(theme.spacing?.['2xl']).toBe('2rem');
    expect(theme.autoContrast).toBe(true);
  });

  it('keeps Mantine default shade selection for non-Tinyrack colors', () => {
    const theme = createTinyrackMantineTheme();
    const resolvedTheme = mergeMantineTheme(DEFAULT_THEME, theme);

    expect(resolvedTheme.primaryShade).toEqual(DEFAULT_THEME.primaryShade);
  });

  it('exports a reusable singleton theme', () => {
    expect(tinyrackMantineTheme).toEqual(createTinyrackMantineTheme());
  });

  it('keeps tinyrack button variants readable on white backgrounds', () => {
    const theme = createTinyrackMantineTheme();
    const resolvedTheme = mergeMantineTheme(DEFAULT_THEME, theme);

    const filledVariant = theme.variantColorResolver?.({
      autoContrast: theme.autoContrast ?? false,
      color: 'tinyrack',
      theme: resolvedTheme,
      variant: 'filled',
    });

    const whiteVariant = theme.variantColorResolver?.({
      autoContrast: theme.autoContrast ?? false,
      color: 'tinyrack',
      theme: resolvedTheme,
      variant: 'white',
    });

    expect(filledVariant).toMatchObject({
      background: 'var(--tinyrack-primary)',
      color: tinyrackFilledTextVariable,
      hover: 'var(--tinyrack-accent)',
    });

    expect(whiteVariant).toMatchObject({
      background: 'var(--mantine-color-white)',
      color: '#0a0a0a',
    });
  });

  it('keeps Mantine primary filled fallback components on scheme-aware text', () => {
    const theme = createTinyrackMantineTheme();

    expect(componentDefaultProp(theme, 'Avatar', 'color')).toBe('tinyrack');
    expect(componentDefaultProp(theme, 'Avatar', 'variant')).toBe('filled');
    expect(componentDefaultProp(theme, 'Button', 'color')).toBe('tinyrack');
    expect(componentDefaultProp(theme, 'Badge', 'color')).toBe('tinyrack');
    expect(componentDefaultProp(theme, 'Checkbox', 'color')).toBe('tinyrack');
    expect(componentDefaultProp(theme, 'Chip', 'color')).toBe('tinyrack');
    expect(componentDefaultProp(theme, 'Drawer', 'radius')).toBe('md');
    expect(componentDefaultProp(theme, 'Loader', 'color')).toBe('tinyrack');
    expect(componentDefaultProp(theme, 'Menu', 'radius')).toBe('md');
    expect(componentDefaultProp(theme, 'Menu', 'shadow')).toBe('none');
    expect(componentDefaultProp(theme, 'Modal', 'radius')).toBe('md');
    expect(componentDefaultProp(theme, 'Pagination', 'color')).toBe('tinyrack');
    expect(componentDefaultProp(theme, 'PaginationRoot', 'color')).toBe('tinyrack');
    expect(componentDefaultProp(theme, 'Radio', 'color')).toBe('tinyrack');
    expect(componentDefaultProp(theme, 'RangeSlider', 'color')).toBe('tinyrack');
    expect(componentDefaultProp(theme, 'RangeSlider', 'size')).toBe('md');
    expect(componentDefaultProp(theme, 'Rating', 'color')).toBe('tinyrack');
    expect(componentDefaultProp(theme, 'Slider', 'color')).toBe('tinyrack');
    expect(componentDefaultProp(theme, 'Slider', 'size')).toBe('md');
    expect(componentDefaultProp(theme, 'Switch', 'color')).toBe('tinyrack');
    expect(componentDefaultProp(theme, 'Table', 'horizontalSpacing')).toBe('md');
    expect(componentDefaultProp(theme, 'Table', 'verticalSpacing')).toBe('md');
    expect(componentDefaultProp(theme, 'Tooltip', 'color')).toBe('tinyrack');
    expect(componentDefaultProp(theme, 'Tooltip', 'radius')).toBe('sm');
    expect(componentDefaultProp(theme, 'ThemeIcon', 'color')).toBe('tinyrack');
    expect(componentRootVar(theme, 'Avatar', '--avatar-bg')).toBe(
      'var(--tinyrack-surface-muted)',
    );
    expect(componentRootVar(theme, 'Avatar', '--avatar-color')).toBe(
      'var(--tinyrack-text)',
    );
    expect(componentRootVar(theme, 'Badge', '--badge-color')).toBe(
      tinyrackFilledTextVariable,
    );
    expect(componentRootVar(theme, 'Chip', '--chip-color')).toBe(
      tinyrackFilledTextVariable,
    );
    expect(componentRootVar(theme, 'Checkbox', '--checkbox-color')).toBe(
      'var(--tinyrack-primary)',
    );
    expect(componentRootVar(theme, 'Checkbox', '--checkbox-icon-color')).toBe(
      tinyrackFilledTextVariable,
    );
    expect(componentRootVar(theme, 'Indicator', '--indicator-color')).toBe(
      'var(--tinyrack-primary)',
    );
    expect(componentRootVar(theme, 'Indicator', '--indicator-text-color')).toBe(
      tinyrackFilledTextVariable,
    );
    expect(componentRootVar(theme, 'Loader', '--loader-color')).toBe(
      'var(--tinyrack-primary)',
    );
    expect(componentRootVar(theme, 'Pagination', '--pagination-active-bg')).toBe(
      'var(--tinyrack-primary)',
    );
    expect(componentRootVar(theme, 'Pagination', '--pagination-active-color')).toBe(
      tinyrackFilledTextVariable,
    );
    expect(componentRootVar(theme, 'Radio', '--radio-color')).toBe(
      'var(--tinyrack-primary)',
    );
    expect(componentRootVar(theme, 'Radio', '--radio-icon-color')).toBe(
      tinyrackFilledTextVariable,
    );
    expect(componentRootVar(theme, 'RangeSlider', '--slider-color')).toBe(
      'var(--tinyrack-primary)',
    );
    expect(componentRootVar(theme, 'Rating', '--rating-color')).toBe(
      'var(--tinyrack-primary)',
    );
    expect(componentRootVar(theme, 'Slider', '--slider-color')).toBe(
      'var(--tinyrack-primary)',
    );
    expect(componentRootVar(theme, 'Switch', '--switch-color')).toBe(
      'var(--tinyrack-primary)',
    );
    expect(componentRootVar(theme, 'ThemeIcon', '--ti-color')).toBe(
      tinyrackFilledTextVariable,
    );
    expect(componentRootVar(theme, 'SegmentedControl', '--sc-color')).toBe(
      'var(--tinyrack-primary)',
    );
    expect(componentRootVar(theme, 'SegmentedControl', '--sc-label-color')).toBe(
      tinyrackFilledTextVariable,
    );
  });

  it('does not override non-tinyrack filled component text colors', () => {
    const theme = createTinyrackMantineTheme();

    expect(
      componentRootVar(theme, 'Avatar', '--avatar-bg', {
        color: 'blue',
      }),
    ).toBeUndefined();
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
      componentRootVar(theme, 'Indicator', '--indicator-color', {
        color: 'blue',
      }),
    ).toBeUndefined();
    expect(
      componentRootVar(theme, 'Loader', '--loader-color', {
        color: 'blue',
      }),
    ).toBeUndefined();
    expect(
      componentRootVar(theme, 'Checkbox', '--checkbox-color', {
        color: 'blue',
      }),
    ).toBeUndefined();
    expect(
      componentRootVar(theme, 'Radio', '--radio-color', {
        color: 'blue',
      }),
    ).toBeUndefined();
    expect(
      componentRootVar(theme, 'RangeSlider', '--slider-color', {
        color: 'blue',
      }),
    ).toBeUndefined();
    expect(
      componentRootVar(theme, 'Rating', '--rating-color', {
        color: 'blue',
      }),
    ).toBeUndefined();
    expect(
      componentRootVar(theme, 'Slider', '--slider-color', {
        color: 'blue',
      }),
    ).toBeUndefined();
    expect(
      componentRootVar(theme, 'Switch', '--switch-color', {
        color: 'blue',
      }),
    ).toBeUndefined();
    expect(
      componentRootVar(theme, 'Pagination', '--pagination-active-bg', {
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
