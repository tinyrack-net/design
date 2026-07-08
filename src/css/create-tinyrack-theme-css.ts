import { tinyrackDaisyUiThemes } from '../daisyui/themes.js';
import {
  tinyrackPalettes,
  tinyrackRadii,
  tinyrackSemanticColors,
  tinyrackSpacing,
  tinyrackTypography,
} from '../tokens/index.js';

export type TinyrackGeneratedCssPath =
  | 'tailwind/theme.css'
  | 'tailwind/daisyui.css'
  | 'tailwind/mantine.css'
  | 'daisyui/theme.css'
  | 'mantine/styles.css'
  | 'astro/starlight/theme.css';

type CssDeclaration = readonly [property: string, value: string];
type SemanticMode = keyof typeof tinyrackSemanticColors;

const generatedHeader =
  '/* Generated from src/css/create-tinyrack-theme-css.ts. Do not edit directly. */';

const tinyrackThemeSelectors = [
  '[data-theme="tinyrack-light"]',
  '[data-theme="tinyrack-dark"]',
] as const;

const mantineColorSchemeSelectors = [
  '[data-mantine-color-scheme="light"]',
  '[data-mantine-color-scheme="dark"]',
] as const;

function createFile(...sections: string[]) {
  return `${generatedHeader}\n\n${sections.join('\n\n')}\n`;
}

function createBlock(selector: string, declarations: readonly CssDeclaration[]) {
  return `${selector} {\n${declarations
    .map(([property, value]) => {
      const separator = value.startsWith('\n') ? ':' : ': ';

      return `  ${property}${separator}${value};`;
    })
    .join('\n')}\n}`;
}

function createWrappedFontStack(fontStack: string) {
  return `\n    ${fontStack}`;
}

function createFontFallbackVar(name: string, fontStack: string) {
  const fallbackLines = fontStack.split(', ');

  return `var(\n    ${name},\n${fallbackLines
    .map((line, index) => `    ${line}${index === fallbackLines.length - 1 ? '' : ','}`)
    .join('\n')}\n  )`;
}

function createSelectorList(selectors: readonly string[]) {
  return `:where(${selectors.join(', ')})`;
}

function createScopedLanguageSelector(
  scopeSelectors: readonly string[] | undefined,
  language: string,
) {
  const languageSelector = `:lang(${language})`;

  if (!scopeSelectors) {
    return `:where(${languageSelector})`;
  }

  return `:where(${scopeSelectors
    .flatMap((scopeSelector) => [
      `${scopeSelector}${languageSelector}`,
      `${scopeSelector} ${languageSelector}`,
    ])
    .join(', ')})`;
}

function createTinyrackTokenDeclarations(
  namespace: string,
  tokens: Record<string, string>,
): CssDeclaration[] {
  return Object.entries(tokens).map(
    ([name, value]) => [`--tinyrack-${namespace}-${name}`, value] as const,
  );
}

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

function createLanguageFontCss(scopeSelectors?: readonly string[]) {
  return [
    createBlock(createScopedLanguageSelector(scopeSelectors, 'ko'), [
      ['font-family', 'var(--tinyrack-font-korean)'],
    ]),
    createBlock(createScopedLanguageSelector(scopeSelectors, 'ja'), [
      ['font-family', 'var(--tinyrack-font-japanese)'],
    ]),
  ].join('\n\n');
}

function createSemanticDeclarations(mode: SemanticMode): CssDeclaration[] {
  const colors = tinyrackSemanticColors[mode];

  return [
    ['--tinyrack-background', colors.background],
    ['--tinyrack-canvas', colors.canvas],
    ['--tinyrack-surface', colors.surface],
    ['--tinyrack-surface-raised', colors.surfaceRaised],
    ['--tinyrack-surface-muted', colors.surfaceMuted],
    ['--tinyrack-surface-inset', colors.surfaceInset],
    ['--tinyrack-text', colors.text],
    ['--tinyrack-text-muted', colors.textMuted],
    ['--tinyrack-border-subtle', colors.borderSubtle],
    ['--tinyrack-border', colors.border],
    ['--tinyrack-border-strong', colors.borderStrong],
    ['--tinyrack-focus', colors.focus],
    ['--tinyrack-primary', colors.primary],
    ['--tinyrack-primary-contrast', colors.primaryContent],
    ['--tinyrack-secondary', colors.secondary],
    ['--tinyrack-secondary-contrast', colors.secondaryContent],
    ['--tinyrack-accent', colors.accent],
    ['--tinyrack-accent-contrast', colors.accentContent],
    ['--tinyrack-success', colors.success],
    ['--tinyrack-success-contrast', colors.successContent],
    ['--tinyrack-warning', colors.warning],
    ['--tinyrack-warning-contrast', colors.warningContent],
    ['--tinyrack-error', colors.error],
    ['--tinyrack-error-contrast', colors.errorContent],
    ['--tinyrack-info', colors.info],
    ['--tinyrack-info-contrast', colors.infoContent],
  ];
}

function createBaseDeclarations(): CssDeclaration[] {
  return [
    ['--tinyrack-font-body', createWrappedFontStack(tinyrackTypography.fontStack.body)],
    [
      '--tinyrack-font-heading',
      createWrappedFontStack(tinyrackTypography.fontStack.heading),
    ],
    ['--tinyrack-font-mono', createWrappedFontStack(tinyrackTypography.fontStack.mono)],
    [
      '--tinyrack-font-korean',
      createWrappedFontStack(tinyrackTypography.fontStack.korean),
    ],
    [
      '--tinyrack-font-japanese',
      createWrappedFontStack(tinyrackTypography.fontStack.japanese),
    ],
    ...createTinyrackTokenDeclarations('text', tinyrackTypography.fontSize),
    ...createTinyrackTokenDeclarations('leading', tinyrackTypography.lineHeight),
    ...createTinyrackTokenDeclarations('tracking', tinyrackTypography.letterSpacing),
    ['--tinyrack-black', tinyrackPalettes.brand[950]],
    ['--tinyrack-primary-solid', tinyrackSemanticColors.light.primary],
    ['--tinyrack-radius-selector', tinyrackRadii.md],
    ['--tinyrack-radius-field', tinyrackRadii.sm],
    ['--tinyrack-radius-box', tinyrackRadii.lg],
  ];
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
    createLanguageFontCss(tinyrackThemeSelectors),
  );
}

function createDaisyUiThemeBlock(theme: (typeof tinyrackDaisyUiThemes)[SemanticMode]) {
  return createBlock('@plugin "daisyui/theme"', [
    ['name', `"${theme.name}"`],
    ['default', String(theme.isDefault)],
    ['prefersdark', String(theme.prefersDark)],
    ['color-scheme', theme.colorScheme],
    ...Object.entries(theme.tokens),
  ]);
}

export function createTinyrackDaisyUiThemeCss() {
  return createFile(
    createDaisyUiThemeBlock(tinyrackDaisyUiThemes.light),
    createDaisyUiThemeBlock(tinyrackDaisyUiThemes.dark),
  );
}

function createDaisyUiPluginThemeLine(
  theme: (typeof tinyrackDaisyUiThemes)[SemanticMode],
  index: number,
  total: number,
) {
  const flags = [
    theme.isDefault ? '--default' : undefined,
    theme.prefersDark ? '--prefersdark' : undefined,
  ].filter(Boolean);
  const suffix = flags.length > 0 ? ` ${flags.join(' ')}` : '';
  const terminator = index === total - 1 ? ';' : ',';

  return `    ${theme.name}${suffix}${terminator}`;
}

export function createTinyrackTailwindDaisyUiCss() {
  const themes = Object.values(tinyrackDaisyUiThemes);

  return createFile(
    '@import "./theme.css";',
    '@import "../daisyui/theme.css";',
    `@plugin "daisyui" {\n  themes:\n${themes
      .map((theme, index) => createDaisyUiPluginThemeLine(theme, index, themes.length))
      .join('\n')}\n}`,
  );
}

export function createTinyrackTailwindMantineCss() {
  return createFile('@import "./theme.css";', '@import "../mantine/styles.css";');
}

function createMantineSchemeDeclarations(mode: SemanticMode): CssDeclaration[] {
  const colors = tinyrackSemanticColors[mode];
  const stepperOutlineColor =
    mode === 'light' ? tinyrackPalettes.neutral[200] : tinyrackPalettes.neutral[700];

  return [
    ...createSemanticDeclarations(mode),
    ['--tinyrack-mantine-filled-color', colors.primaryContent],
    ['--tinyrack-mantine-stepper-outline-color', stepperOutlineColor],
    ['--mantine-color-disabled-color', `${colors.textMuted} !important`],
  ];
}

export function createTinyrackMantineStylesCss() {
  return createFile(
    createBlock(
      createSelectorList(mantineColorSchemeSelectors),
      createBaseDeclarations(),
    ),
    createBlock(
      '[data-mantine-color-scheme="light"]',
      createMantineSchemeDeclarations('light'),
    ),
    createBlock(
      '[data-mantine-color-scheme="dark"]',
      createMantineSchemeDeclarations('dark'),
    ),
    createBlock('.mantine-focus-auto:focus-visible', [
      ['outline-color', 'var(--mantine-primary-color-filled)'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Stepper-root', [
      [
        '--stepper-outline-color',
        'var(--tinyrack-mantine-stepper-outline-color) !important',
      ],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Stepper-stepIcon:not([data-completed])',
      [
        [
          'background-color',
          'var(--tinyrack-mantine-stepper-outline-color) !important',
        ],
        ['border-color', 'var(--tinyrack-mantine-stepper-outline-color) !important'],
      ],
    ),
    createBlock(
      '[data-mantine-color-scheme] .mantine-SegmentedControl-label:not([data-active]):not([data-disabled]) .mantine-SegmentedControl-innerLabel',
      [['color', 'var(--tinyrack-text) !important']],
    ),
    createBlock(
      '[data-mantine-color-scheme] .mantine-SegmentedControl-label[data-active] .mantine-SegmentedControl-innerLabel',
      [['color', 'var(--tinyrack-mantine-filled-color) !important']],
    ),
    createLanguageFontCss(mantineColorSchemeSelectors),
  );
}

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
    createLanguageFontCss(),
    createStarlightDesktopRhythmCss(),
    createStarlightComponentRhythmCss(),
  );
}

export function createTinyrackThemeCssFiles(): Record<
  TinyrackGeneratedCssPath,
  string
> {
  return {
    'tailwind/theme.css': createTinyrackTailwindThemeCss(),
    'tailwind/daisyui.css': createTinyrackTailwindDaisyUiCss(),
    'tailwind/mantine.css': createTinyrackTailwindMantineCss(),
    'daisyui/theme.css': createTinyrackDaisyUiThemeCss(),
    'mantine/styles.css': createTinyrackMantineStylesCss(),
    'astro/starlight/theme.css': createTinyrackStarlightThemeCss(),
  };
}
