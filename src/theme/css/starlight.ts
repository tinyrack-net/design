import { tinyrackDaisyUiThemes } from '../../integrations/daisyui/themes.js';
import { tinyrackPalettes } from '../colors.js';
import { tinyrackRadii } from '../radii.js';
import { tinyrackSpacing } from '../spacing.js';
import { tinyrackTypography } from '../typography.js';
import {
  type CssDeclaration,
  createBlock,
  createFile,
  createFontFallbackVar,
} from './render.js';
import { createBaseDeclarations, type SemanticMode } from './tinyrack-declarations.js';

function createStarlightRhythmDeclarations(): CssDeclaration[] {
  return [
    ['--tinyrack-starlight-space-xs', tinyrackSpacing.xs],
    ['--tinyrack-starlight-space-sm', tinyrackSpacing.sm],
    ['--tinyrack-starlight-space-md', tinyrackSpacing.md],
    ['--tinyrack-starlight-space-lg', tinyrackSpacing.lg],
    ['--tinyrack-starlight-space-xl', tinyrackSpacing.xl],
    ['--tinyrack-starlight-space-2xl', tinyrackSpacing['2xl']],
    ['--tinyrack-starlight-radius-control', tinyrackRadii.md],
    ['--tinyrack-starlight-radius-surface', tinyrackRadii.lg],
    ['--tinyrack-starlight-radius-pill', tinyrackRadii.full],
    ['--sl-content-pad-x', 'var(--tinyrack-starlight-space-lg)'],
    ['--sl-sidebar-pad-x', 'var(--tinyrack-starlight-space-lg)'],
    ['--sl-content-gap-y', 'var(--tinyrack-starlight-space-lg)'],
    ['--sl-text-2xs', tinyrackTypography.fontSize['2xs']],
    ['--sl-text-xs', tinyrackTypography.fontSize.xs],
    ['--sl-text-sm', tinyrackTypography.fontSize.sm],
    ['--sl-text-base', tinyrackTypography.fontSize.md],
    ['--sl-text-lg', tinyrackTypography.fontSize.lg],
    ['--sl-text-xl', tinyrackTypography.fontSize.xl],
    ['--sl-text-2xl', tinyrackTypography.fontSize['2xl']],
    ['--sl-text-3xl', tinyrackTypography.fontSize['3xl']],
    ['--sl-text-4xl', tinyrackTypography.fontSize['4xl']],
    ['--sl-text-5xl', tinyrackTypography.fontSize['5xl']],
    ['--sl-text-body', 'var(--sl-text-base)'],
    ['--sl-text-body-sm', 'var(--sl-text-xs)'],
    ['--sl-text-code', 'var(--sl-text-sm)'],
    ['--sl-text-code-sm', 'var(--sl-text-xs)'],
    ['--sl-text-h1', 'var(--sl-text-4xl)'],
    ['--sl-text-h2', 'var(--sl-text-3xl)'],
    ['--sl-text-h3', 'var(--sl-text-2xl)'],
    ['--sl-text-h4', 'var(--sl-text-xl)'],
    ['--sl-text-h5', 'var(--sl-text-lg)'],
    ['--sl-line-height', tinyrackTypography.lineHeight.xl],
    ['--sl-line-height-headings', tinyrackTypography.lineHeight.sm],
  ];
}

function createStarlightDesktopRhythmCss() {
  return `@media (min-width: 72rem) {
  :root {
    --sl-content-pad-x: var(--tinyrack-starlight-space-xl);
    --sl-sidebar-pad-x: var(--tinyrack-starlight-space-xl);
  }
}`;
}

function createStarlightComponentRhythmCss() {
  return `@layer starlight.components {
  .card {
    border-radius: var(--tinyrack-starlight-radius-surface);
    gap: var(--tinyrack-starlight-space-md);
    padding: var(--tinyrack-starlight-space-lg);
  }

  .card .icon {
    border-radius: var(--tinyrack-starlight-radius-control);
  }

  .card .body {
    font-size: var(--sl-text-body);
  }

  .sl-link-card {
    border-radius: var(--tinyrack-starlight-radius-surface);
    gap: var(--tinyrack-starlight-space-sm);
    padding: var(--tinyrack-starlight-space-lg);
  }

  starlight-tabs [role="tab"] {
    min-height: 2.5rem;
    padding-block: var(--tinyrack-starlight-space-sm);
  }
}`;
}

function createStarlightColorDeclarations(mode: SemanticMode): CssDeclaration[] {
  const tokens = tinyrackDaisyUiThemes[mode].tokens;

  if (mode === 'light') {
    return [
      ['--sl-color-accent-low', tokens['--color-base-200']],
      ['--sl-color-accent', tokens['--color-primary']],
      ['--sl-color-accent-high', tinyrackPalettes.neutral[950]],
      ['--sl-color-white', tokens['--color-base-100']],
      ['--sl-color-gray-1', tokens['--color-primary-content']],
      ['--sl-color-gray-2', tokens['--color-secondary']],
      ['--sl-color-gray-3', tokens['--color-base-300']],
      ['--sl-color-gray-4', tinyrackPalettes.neutral[400]],
      ['--sl-color-gray-5', tokens['--color-accent']],
      ['--sl-color-gray-6', tokens['--color-info']],
      ['--sl-color-black', tokens['--color-neutral']],
    ];
  }

  return [
    ['--sl-color-accent-low', tokens['--color-neutral']],
    ['--sl-color-accent', tokens['--color-primary']],
    ['--sl-color-accent-high', tokens['--color-neutral-content']],
    ['--sl-color-white', tokens['--color-base-content']],
    ['--sl-color-gray-1', tokens['--color-neutral-content']],
    ['--sl-color-gray-2', tokens['--color-info']],
    ['--sl-color-gray-3', tokens['--color-accent']],
    ['--sl-color-gray-4', tinyrackPalettes.neutral[500]],
    ['--sl-color-gray-5', tokens['--color-secondary']],
    ['--sl-color-gray-6', tokens['--color-neutral']],
    ['--sl-color-black', tokens['--color-base-100']],
  ];
}

export function createTinyrackStarlightThemeCss() {
  return createFile(
    createBlock(':root', [
      ...createBaseDeclarations(),
      ...createStarlightRhythmDeclarations(),
      [
        '--sl-font',
        createFontFallbackVar(
          '--tinyrack-font-body',
          tinyrackTypography.fontStack.body,
        ),
      ],
      [
        '--sl-font-mono',
        createFontFallbackVar(
          '--tinyrack-font-mono',
          tinyrackTypography.fontStack.mono,
        ),
      ],
      ...createStarlightColorDeclarations('light'),
    ]),
    createBlock(':root[data-theme="dark"]', createStarlightColorDeclarations('dark')),
    createStarlightDesktopRhythmCss(),
    createStarlightComponentRhythmCss(),
  );
}
