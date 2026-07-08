import { tinyrackTypography } from '../typography.js';
import {
  type CssDeclaration,
  createBlock,
  createFile,
  createSelectorList,
} from './render.js';
import {
  createBaseDeclarations,
  createSemanticDeclarations,
} from './tinyrack-declarations.js';

const tinyrackThemeSelectors = [
  '[data-theme="tinyrack-light"]',
  '[data-theme="tinyrack-dark"]',
] as const;

function createTailwindThemeTokenDeclarations(
  namespace: string,
  tokens: Record<string, string>,
): CssDeclaration[] {
  return Object.keys(tokens).map(
    (name) =>
      [
        `--${namespace}-tinyrack-${name}`,
        `var(--tinyrack-${namespace}-${name})`,
      ] as const,
  );
}

const tailwindFontSizeLineHeight = {
  '2xs': 'sm',
  xs: 'sm',
  sm: 'md',
  md: 'md',
  lg: 'md',
  xl: 'sm',
  '2xl': 'sm',
  '3xl': 'sm',
  '4xl': 'sm',
  '5xl': 'sm',
} as const satisfies Record<
  keyof typeof tinyrackTypography.fontSize,
  keyof typeof tinyrackTypography.lineHeight
>;

function createTailwindTextDeclarations(): CssDeclaration[] {
  return Object.keys(tinyrackTypography.fontSize).flatMap((name) => {
    const sizeName = name as keyof typeof tinyrackTypography.fontSize;
    const lineHeightName = tailwindFontSizeLineHeight[sizeName];

    return [
      [`--text-tinyrack-${name}`, `var(--tinyrack-text-${name})`] as const,
      [
        `--text-tinyrack-${name}--line-height`,
        `var(--tinyrack-leading-${lineHeightName})`,
      ] as const,
    ];
  });
}

function createTailwindThemeDeclarations(): CssDeclaration[] {
  return [
    ['--font-tinyrack-body', 'var(--tinyrack-font-body)'],
    ['--font-tinyrack-heading', 'var(--tinyrack-font-heading)'],
    ['--font-tinyrack-mono', 'var(--tinyrack-font-mono)'],
    ['--font-tinyrack-korean', 'var(--tinyrack-font-korean)'],
    ['--font-tinyrack-japanese', 'var(--tinyrack-font-japanese)'],
    ...createTailwindTextDeclarations(),
    ...createTailwindThemeTokenDeclarations('leading', tinyrackTypography.lineHeight),
    ...createTailwindThemeTokenDeclarations(
      'tracking',
      tinyrackTypography.letterSpacing,
    ),
    ['--color-tinyrack-black', 'var(--tinyrack-black)'],
    ['--color-tinyrack-canvas', 'var(--tinyrack-canvas)'],
    ['--color-tinyrack-surface', 'var(--tinyrack-surface)'],
    ['--color-tinyrack-surface-raised', 'var(--tinyrack-surface-raised)'],
    ['--color-tinyrack-surface-muted', 'var(--tinyrack-surface-muted)'],
    ['--color-tinyrack-surface-inset', 'var(--tinyrack-surface-inset)'],
    ['--color-tinyrack-border-subtle', 'var(--tinyrack-border-subtle)'],
    ['--color-tinyrack-border', 'var(--tinyrack-border)'],
    ['--color-tinyrack-border-strong', 'var(--tinyrack-border-strong)'],
    ['--color-tinyrack-text', 'var(--tinyrack-text)'],
    ['--color-tinyrack-text-muted', 'var(--tinyrack-text-muted)'],
    ['--color-tinyrack-primary', 'var(--tinyrack-primary)'],
    ['--color-tinyrack-primary-contrast', 'var(--tinyrack-primary-contrast)'],
    ['--color-tinyrack-primary-solid', 'var(--tinyrack-primary-solid)'],
    ['--color-tinyrack-secondary', 'var(--tinyrack-secondary)'],
    ['--color-tinyrack-secondary-contrast', 'var(--tinyrack-secondary-contrast)'],
    ['--color-tinyrack-accent', 'var(--tinyrack-accent)'],
    ['--color-tinyrack-accent-contrast', 'var(--tinyrack-accent-contrast)'],
    ['--color-tinyrack-success', 'var(--tinyrack-success)'],
    ['--color-tinyrack-success-contrast', 'var(--tinyrack-success-contrast)'],
    ['--color-tinyrack-warning', 'var(--tinyrack-warning)'],
    ['--color-tinyrack-warning-contrast', 'var(--tinyrack-warning-contrast)'],
    ['--color-tinyrack-error', 'var(--tinyrack-error)'],
    ['--color-tinyrack-error-contrast', 'var(--tinyrack-error-contrast)'],
    ['--color-tinyrack-info', 'var(--tinyrack-info)'],
    ['--color-tinyrack-info-contrast', 'var(--tinyrack-info-contrast)'],
    ['--radius-tinyrack-selector', 'var(--tinyrack-radius-selector)'],
    ['--radius-tinyrack-field', 'var(--tinyrack-radius-field)'],
    ['--radius-tinyrack-box', 'var(--tinyrack-radius-box)'],
  ];
}

export function createTinyrackTailwindThemeCss() {
  return createFile(
    createBlock('@theme static', createTailwindThemeDeclarations()),
    createBlock(createSelectorList(tinyrackThemeSelectors), createBaseDeclarations()),
    createBlock('[data-theme="tinyrack-light"]', createSemanticDeclarations('light')),
    createBlock('[data-theme="tinyrack-dark"]', createSemanticDeclarations('dark')),
  );
}

export function createTinyrackTailwindMantineCss() {
  return createFile('@import "./theme.css";', '@import "../mantine/styles.css";');
}
