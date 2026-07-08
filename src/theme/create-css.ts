import { tinyrackDaisyUiThemes } from '../integrations/daisyui/themes.js';
import { tinyrackPalettes } from './colors.js';
import {
  tinyrackAvatarContract,
  tinyrackBadgeContract,
  tinyrackBreadcrumbsContract,
  tinyrackControlContract,
  tinyrackControlSizeNames,
  tinyrackIndicatorContract,
  tinyrackKbdContract,
  tinyrackListContract,
  tinyrackLoaderContract,
  tinyrackMenuContract,
  tinyrackOverlayContract,
  tinyrackProgressContract,
  tinyrackRadialProgressContract,
  tinyrackRangeContract,
  tinyrackRatingContract,
  tinyrackSelectionControlContract,
  tinyrackStepperContract,
  tinyrackSwitchContract,
  tinyrackTableContract,
  tinyrackTabsContract,
  tinyrackTimelineContract,
  tinyrackTooltipContract,
} from './components.js';
import { tinyrackRadii } from './radii.js';
import { tinyrackSemanticColors } from './semantic.js';
import { tinyrackSpacing } from './spacing.js';
import { tinyrackTypography } from './typography.js';

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
  '/* Generated from src/theme/create-css.ts. Do not edit directly. */';

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

function createTinyrackTokenDeclarations(
  namespace: string,
  tokens: Record<string, string>,
): CssDeclaration[] {
  return Object.entries(tokens).map(
    ([name, value]) => [`--tinyrack-${namespace}-${name}`, value] as const,
  );
}

function createTinyrackControlDeclarations(): CssDeclaration[] {
  return [
    ['--tinyrack-control-radius', tinyrackControlContract.radius],
    ['--tinyrack-control-border-width', tinyrackControlContract.borderWidth],
    ['--tinyrack-control-font-weight', tinyrackControlContract.fontWeight],
    ...tinyrackControlSizeNames.flatMap((size) => {
      const tokens = tinyrackControlContract.sizes[size];

      return [
        [`--tinyrack-control-height-${size}`, tokens.height] as const,
        [`--tinyrack-control-padding-x-${size}`, tokens.paddingX] as const,
        [`--tinyrack-control-padding-y-${size}`, tokens.paddingY] as const,
        [`--tinyrack-control-font-size-${size}`, tokens.fontSize] as const,
        [`--tinyrack-control-gap-${size}`, tokens.gap] as const,
        [`--tinyrack-control-icon-size-${size}`, tokens.iconSize] as const,
      ];
    }),
  ];
}

function createTinyrackBadgeDeclarations(): CssDeclaration[] {
  return [
    ['--tinyrack-badge-radius', tinyrackBadgeContract.radius],
    ['--tinyrack-badge-border-width', tinyrackBadgeContract.borderWidth],
    ['--tinyrack-badge-font-weight', tinyrackBadgeContract.fontWeight],
    ...tinyrackControlSizeNames.flatMap((size) => {
      const tokens = tinyrackBadgeContract.sizes[size];

      return [
        [`--tinyrack-badge-height-${size}`, tokens.height] as const,
        [`--tinyrack-badge-font-size-${size}`, tokens.fontSize] as const,
      ];
    }),
  ];
}

function createTinyrackAvatarDeclarations(): CssDeclaration[] {
  return [
    ['--tinyrack-avatar-background', tinyrackAvatarContract.background],
    ['--tinyrack-avatar-border-width', tinyrackAvatarContract.borderWidth],
    ['--tinyrack-avatar-color', tinyrackAvatarContract.color],
    ['--tinyrack-avatar-radius', tinyrackAvatarContract.radius],
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackAvatarContract.sizes[size];

      return [`--tinyrack-avatar-size-${size}`, tokens.size] as const;
    }),
  ];
}

function createTinyrackIndicatorDeclarations(): CssDeclaration[] {
  return [
    ['--tinyrack-indicator-background', tinyrackIndicatorContract.background],
    ['--tinyrack-indicator-color', tinyrackIndicatorContract.color],
    ['--tinyrack-indicator-radius', tinyrackIndicatorContract.radius],
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackIndicatorContract.sizes[size];

      return [`--tinyrack-indicator-size-${size}`, tokens.size] as const;
    }),
  ];
}

function createTinyrackKbdDeclarations(): CssDeclaration[] {
  return [
    ['--tinyrack-kbd-background', tinyrackKbdContract.background],
    ['--tinyrack-kbd-radius', tinyrackKbdContract.radius],
    ['--tinyrack-kbd-border-width', tinyrackKbdContract.borderWidth],
    ['--tinyrack-kbd-border-bottom-width', tinyrackKbdContract.borderBottomWidth],
    ['--tinyrack-kbd-font-weight', tinyrackKbdContract.fontWeight],
    ...tinyrackControlSizeNames.flatMap((size) => {
      const tokens = tinyrackKbdContract.sizes[size];

      return [
        [`--tinyrack-kbd-height-${size}`, tokens.height] as const,
        [`--tinyrack-kbd-font-size-${size}`, tokens.fontSize] as const,
      ];
    }),
  ];
}

function createTinyrackSelectionControlDeclarations(): CssDeclaration[] {
  return [
    [
      '--tinyrack-selection-control-border-width',
      tinyrackSelectionControlContract.borderWidth,
    ],
    [
      '--tinyrack-selection-control-checkbox-radius',
      tinyrackSelectionControlContract.checkboxRadius,
    ],
    [
      '--tinyrack-selection-control-radio-radius',
      tinyrackSelectionControlContract.radioRadius,
    ],
    ...tinyrackControlSizeNames.flatMap((size) => {
      const tokens = tinyrackSelectionControlContract.sizes[size];

      return [
        [`--tinyrack-selection-control-size-${size}`, tokens.size] as const,
        [`--tinyrack-selection-control-padding-${size}`, tokens.padding] as const,
      ];
    }),
  ];
}

function createTinyrackSwitchDeclarations(): CssDeclaration[] {
  return [
    ['--tinyrack-switch-border-width', tinyrackSwitchContract.borderWidth],
    ['--tinyrack-switch-radius', tinyrackSwitchContract.radius],
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackSwitchContract.sizes[size];

      return [`--tinyrack-switch-height-${size}`, tokens.height] as const;
    }),
  ];
}

function createTinyrackProgressDeclarations(): CssDeclaration[] {
  return [
    ['--tinyrack-progress-radius', tinyrackProgressContract.radius],
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackProgressContract.sizes[size];

      return [`--tinyrack-progress-size-${size}`, tokens.size] as const;
    }),
  ];
}

function createTinyrackLoaderDeclarations(): CssDeclaration[] {
  return [
    ['--tinyrack-loader-color', tinyrackLoaderContract.color],
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackLoaderContract.sizes[size];

      return [`--tinyrack-loader-size-${size}`, tokens.height] as const;
    }),
  ];
}

function createTinyrackRatingDeclarations(): CssDeclaration[] {
  return [
    ['--tinyrack-rating-color', tinyrackRatingContract.color],
    ['--tinyrack-rating-empty-color', tinyrackRatingContract.emptyColor],
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackRatingContract.sizes[size];

      return [`--tinyrack-rating-size-${size}`, tokens.height] as const;
    }),
  ];
}

function createTinyrackRadialProgressDeclarations(): CssDeclaration[] {
  return [
    ['--tinyrack-radial-progress-color', tinyrackRadialProgressContract.color],
    [
      '--tinyrack-radial-progress-empty-color',
      tinyrackRadialProgressContract.emptyColor,
    ],
    ...tinyrackControlSizeNames.flatMap((size) => {
      const tokens = tinyrackRadialProgressContract.sizes[size];

      return [
        [`--tinyrack-radial-progress-size-${size}`, tokens.size] as const,
        [`--tinyrack-radial-progress-thickness-${size}`, tokens.thickness] as const,
      ];
    }),
  ];
}

function createTinyrackNavigationDataDeclarations(): CssDeclaration[] {
  return [
    ['--tinyrack-breadcrumbs-color', tinyrackBreadcrumbsContract.color],
    ['--tinyrack-breadcrumbs-font-size', tinyrackBreadcrumbsContract.fontSize],
    ['--tinyrack-breadcrumbs-gap', tinyrackBreadcrumbsContract.gap],
    [
      '--tinyrack-breadcrumbs-separator-color',
      tinyrackBreadcrumbsContract.separatorColor,
    ],
    ['--tinyrack-list-background', tinyrackListContract.background],
    ['--tinyrack-list-border-color', tinyrackListContract.borderColor],
    ['--tinyrack-list-color', tinyrackListContract.color],
    ['--tinyrack-list-divider-color', tinyrackListContract.dividerColor],
    ['--tinyrack-list-font-size', tinyrackListContract.fontSize],
    ['--tinyrack-list-gap', tinyrackListContract.gap],
    ['--tinyrack-list-line-height', tinyrackListContract.lineHeight],
    ['--tinyrack-list-padding', tinyrackListContract.padding],
    ['--tinyrack-list-radius', tinyrackListContract.radius],
    ['--tinyrack-table-border-color', tinyrackTableContract.borderColor],
    ['--tinyrack-table-color', tinyrackTableContract.color],
    ['--tinyrack-table-header-color', tinyrackTableContract.headerColor],
    ['--tinyrack-table-hover-color', tinyrackTableContract.hoverColor],
    ['--tinyrack-table-radius', tinyrackTableContract.radius],
    ['--tinyrack-table-striped-color', tinyrackTableContract.stripedColor],
    ...tinyrackControlSizeNames.flatMap((size) => {
      const tokens = tinyrackTableContract.sizes[size];

      return [
        [`--tinyrack-table-font-size-${size}`, tokens.fontSize] as const,
        [`--tinyrack-table-padding-x-${size}`, tokens.paddingX] as const,
        [`--tinyrack-table-padding-y-${size}`, tokens.paddingY] as const,
      ];
    }),
    ['--tinyrack-tabs-active-background', tinyrackTabsContract.activeBackground],
    ['--tinyrack-tabs-active-color', tinyrackTabsContract.activeColor],
    ['--tinyrack-tabs-background', tinyrackTabsContract.background],
    ['--tinyrack-tabs-border-color', tinyrackTabsContract.borderColor],
    ['--tinyrack-tabs-color', tinyrackTabsContract.color],
    ['--tinyrack-tabs-radius', tinyrackTabsContract.radius],
    ...tinyrackControlSizeNames.flatMap((size) => {
      const tokens = tinyrackTabsContract.sizes[size];

      return [
        [`--tinyrack-tabs-height-${size}`, tokens.height] as const,
        [`--tinyrack-tabs-font-size-${size}`, tokens.fontSize] as const,
        [`--tinyrack-tabs-padding-x-${size}`, tokens.paddingX] as const,
      ];
    }),
    ['--tinyrack-timeline-active-color', tinyrackTimelineContract.activeColor],
    [
      '--tinyrack-timeline-bullet-background',
      tinyrackTimelineContract.bulletBackground,
    ],
    ['--tinyrack-timeline-bullet-size', tinyrackTimelineContract.bulletSize],
    ['--tinyrack-timeline-line-color', tinyrackTimelineContract.lineColor],
    ['--tinyrack-timeline-line-width', tinyrackTimelineContract.lineWidth],
    ['--tinyrack-timeline-radius', tinyrackTimelineContract.radius],
    ['--tinyrack-timeline-title-font-size', tinyrackTimelineContract.titleFontSize],
    ['--tinyrack-timeline-title-font-weight', tinyrackTimelineContract.titleFontWeight],
    ['--tinyrack-stepper-active-color', tinyrackStepperContract.activeColor],
    ['--tinyrack-stepper-active-text-color', tinyrackStepperContract.activeTextColor],
    ['--tinyrack-stepper-inactive-color', tinyrackStepperContract.inactiveColor],
    [
      '--tinyrack-stepper-inactive-text-color',
      tinyrackStepperContract.inactiveTextColor,
    ],
    ['--tinyrack-stepper-radius', tinyrackStepperContract.radius],
    ...tinyrackControlSizeNames.flatMap((size) => {
      const tokens = tinyrackStepperContract.sizes[size];

      return [
        [`--tinyrack-stepper-font-size-${size}`, tokens.fontSize] as const,
        [`--tinyrack-stepper-icon-size-${size}`, tokens.iconSize] as const,
        [`--tinyrack-stepper-line-width-${size}`, tokens.lineWidth] as const,
        [`--tinyrack-stepper-spacing-${size}`, tokens.spacing] as const,
      ];
    }),
    ['--tinyrack-range-color', tinyrackRangeContract.color],
    ['--tinyrack-range-focus-color', tinyrackRangeContract.focusColor],
    ['--tinyrack-range-radius', tinyrackRangeContract.radius],
    ['--tinyrack-range-thumb-color', tinyrackRangeContract.thumbColor],
    ['--tinyrack-range-track-color', tinyrackRangeContract.trackColor],
    ...tinyrackControlSizeNames.flatMap((size) => {
      const tokens = tinyrackRangeContract.sizes[size];

      return [
        [`--tinyrack-range-thumb-size-${size}`, tokens.thumbSize] as const,
        [`--tinyrack-range-track-size-${size}`, tokens.trackSize] as const,
      ];
    }),
  ];
}

function createTinyrackOverlayDeclarations(): CssDeclaration[] {
  return [
    ['--tinyrack-menu-active-background', tinyrackMenuContract.activeBackground],
    ['--tinyrack-menu-active-color', tinyrackMenuContract.activeColor],
    ['--tinyrack-menu-background', tinyrackMenuContract.background],
    ['--tinyrack-menu-border-color', tinyrackMenuContract.borderColor],
    ['--tinyrack-menu-color', tinyrackMenuContract.color],
    ['--tinyrack-menu-divider-color', tinyrackMenuContract.dividerColor],
    ['--tinyrack-menu-hover-background', tinyrackMenuContract.hoverBackground],
    ['--tinyrack-menu-item-radius', tinyrackMenuContract.itemRadius],
    ['--tinyrack-menu-padding', tinyrackMenuContract.padding],
    ['--tinyrack-menu-radius', tinyrackMenuContract.radius],
    ['--tinyrack-menu-shadow', tinyrackMenuContract.shadow],
    ...tinyrackControlSizeNames.flatMap((size) => {
      const tokens = tinyrackMenuContract.sizes[size];

      return [
        [`--tinyrack-menu-font-size-${size}`, tokens.fontSize] as const,
        [`--tinyrack-menu-padding-x-${size}`, tokens.paddingX] as const,
        [`--tinyrack-menu-padding-y-${size}`, tokens.paddingY] as const,
      ];
    }),
    ['--tinyrack-overlay-background', tinyrackOverlayContract.background],
    ['--tinyrack-overlay-border-color', tinyrackOverlayContract.borderColor],
    ['--tinyrack-overlay-color', tinyrackOverlayContract.color],
    ['--tinyrack-overlay-scrim-color', tinyrackOverlayContract.overlayColor],
    ['--tinyrack-overlay-padding', tinyrackOverlayContract.padding],
    ['--tinyrack-overlay-radius', tinyrackOverlayContract.radius],
    ['--tinyrack-overlay-shadow', tinyrackOverlayContract.shadow],
    ['--tinyrack-tooltip-background', tinyrackTooltipContract.background],
    ['--tinyrack-tooltip-color', tinyrackTooltipContract.color],
    ['--tinyrack-tooltip-font-size', tinyrackTooltipContract.fontSize],
    ['--tinyrack-tooltip-line-height', tinyrackTooltipContract.lineHeight],
    ['--tinyrack-tooltip-padding-x', tinyrackTooltipContract.paddingX],
    ['--tinyrack-tooltip-padding-y', tinyrackTooltipContract.paddingY],
    ['--tinyrack-tooltip-radius', tinyrackTooltipContract.radius],
  ];
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
    ...createTinyrackControlDeclarations(),
    ...createTinyrackAvatarDeclarations(),
    ...createTinyrackBadgeDeclarations(),
    ...createTinyrackIndicatorDeclarations(),
    ...createTinyrackKbdDeclarations(),
    ...createTinyrackLoaderDeclarations(),
    ...createTinyrackRatingDeclarations(),
    ...createTinyrackSelectionControlDeclarations(),
    ...createTinyrackSwitchDeclarations(),
    ...createTinyrackProgressDeclarations(),
    ...createTinyrackRadialProgressDeclarations(),
    ...createTinyrackNavigationDataDeclarations(),
    ...createTinyrackOverlayDeclarations(),
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

function createTinyrackDaisyUiButtonParityCss() {
  const blocks = [
    createBlock('.btn', [
      [
        'border-radius',
        `var(--tinyrack-control-radius, ${tinyrackControlContract.radius})`,
      ],
      [
        'font-weight',
        `var(--tinyrack-control-font-weight, ${tinyrackControlContract.fontWeight})`,
      ],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackControlContract.sizes[size];

      return createBlock(`.btn-${size}`, [
        ['--size', `var(--tinyrack-control-height-${size}, ${tokens.height})`],
        ['--btn-p', `var(--tinyrack-control-padding-x-${size}, ${tokens.paddingX})`],
        ['--fontsize', `var(--tinyrack-control-font-size-${size}, ${tokens.fontSize})`],
        ['height', `var(--tinyrack-control-height-${size}, ${tokens.height})`],
        [
          'padding-inline',
          `var(--tinyrack-control-padding-x-${size}, ${tokens.paddingX})`,
        ],
        ['font-size', `var(--tinyrack-control-font-size-${size}, ${tokens.fontSize})`],
        ['gap', `var(--tinyrack-control-gap-${size}, ${tokens.gap})`],
      ]);
    }),
  ];

  return blocks.join('\n\n');
}

function createTinyrackDaisyUiFormControlParityCss() {
  const formControlSelector = '.input, .select, .textarea, .file-input';
  const focusSelector =
    '.input:focus, .input:focus-within, .select:focus, .select:focus-within, .textarea:focus, .textarea:focus-within, .file-input:focus, .file-input:focus-within';

  const blocks = [
    createBlock(formControlSelector, [
      ['--input-color', 'var(--tinyrack-border, var(--color-base-300))'],
      ['background-color', 'var(--tinyrack-surface, var(--color-base-100))'],
      ['border-color', 'var(--tinyrack-border, var(--color-base-300))'],
      [
        'border-radius',
        `var(--tinyrack-control-radius, ${tinyrackControlContract.radius})`,
      ],
      ['box-shadow', 'none'],
      ['color', 'var(--tinyrack-text, var(--color-base-content))'],
    ]),
    createBlock(focusSelector, [
      ['--input-color', 'var(--tinyrack-focus, var(--color-base-content))'],
      ['border-color', 'var(--tinyrack-focus, var(--color-base-content))'],
      ['outline-color', 'var(--tinyrack-focus, var(--color-base-content))'],
    ]),
    createBlock('.file-input::file-selector-button', [
      [
        'border-radius',
        `var(--tinyrack-control-radius, ${tinyrackControlContract.radius})`,
      ],
      [
        'font-weight',
        `var(--tinyrack-control-font-weight, ${tinyrackControlContract.fontWeight})`,
      ],
    ]),
    ...tinyrackControlSizeNames.flatMap((size) => {
      const tokens = tinyrackControlContract.sizes[size];
      const height = `var(--tinyrack-control-height-${size}, ${tokens.height})`;
      const fontSize = `var(--tinyrack-control-font-size-${size}, ${tokens.fontSize})`;
      const paddingX = `var(--tinyrack-control-padding-x-${size}, ${tokens.paddingX})`;
      const paddingY = `var(--tinyrack-control-padding-y-${size}, ${tokens.paddingY})`;

      return [
        createBlock(`.input-${size}, .select-${size}, .file-input-${size}`, [
          ['--font-size-min', fontSize],
          ['--size', height],
          ['font-size', fontSize],
          ['height', height],
        ]),
        createBlock(`.input-${size}, .textarea-${size}, .file-input-${size}`, [
          ['padding-inline', paddingX],
        ]),
        createBlock(`.select-${size}`, [
          ['padding-inline-start', paddingX],
          ['padding-inline-end', `calc(${paddingX} + 1.75rem)`],
        ]),
        createBlock(`.textarea-${size}`, [
          ['--font-size-min', fontSize],
          ['font-size', fontSize],
          ['min-height', height],
          ['padding-block', paddingY],
          ['padding-inline', paddingX],
        ]),
        createBlock(`.file-input-${size}::file-selector-button`, [
          ['font-size', fontSize],
        ]),
      ];
    }),
  ];

  return blocks.join('\n\n');
}

function createTinyrackDaisyUiBadgeParityCss() {
  const blocks = [
    createBlock('.badge', [
      [
        'border-radius',
        `var(--tinyrack-badge-radius, ${tinyrackBadgeContract.radius})`,
      ],
      [
        'border-width',
        `var(--tinyrack-badge-border-width, ${tinyrackBadgeContract.borderWidth})`,
      ],
      [
        'font-weight',
        `var(--tinyrack-badge-font-weight, ${tinyrackBadgeContract.fontWeight})`,
      ],
      ['letter-spacing', '0'],
      ['text-transform', 'none'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackBadgeContract.sizes[size];
      const height = `var(--tinyrack-badge-height-${size}, ${tokens.height})`;
      const fontSize = `var(--tinyrack-badge-font-size-${size}, ${tokens.fontSize})`;

      return createBlock(`.badge-${size}`, [
        ['--size', height],
        ['height', height],
        ['font-size', fontSize],
        [
          'padding-inline',
          `calc(${height} / 2 - var(--tinyrack-badge-border-width, ${tinyrackBadgeContract.borderWidth}))`,
        ],
      ]);
    }),
  ];

  return blocks.join('\n\n');
}

function createTinyrackDaisyUiKbdParityCss() {
  const blocks = [
    createBlock('.kbd', [
      ['align-items', 'center'],
      ['background-color', 'var(--tinyrack-kbd-background, var(--color-base-200))'],
      [
        'border-color',
        'var(--tinyrack-border, color-mix(in srgb, var(--color-base-content) 20%, transparent))',
      ],
      [
        'border-bottom-color',
        'var(--tinyrack-border-strong, var(--tinyrack-border, color-mix(in srgb, var(--color-base-content) 20%, transparent)))',
      ],
      ['border-radius', `var(--tinyrack-kbd-radius, ${tinyrackKbdContract.radius})`],
      [
        'border-width',
        `var(--tinyrack-kbd-border-width, ${tinyrackKbdContract.borderWidth})`,
      ],
      [
        'border-bottom-width',
        `var(--tinyrack-kbd-border-bottom-width, ${tinyrackKbdContract.borderBottomWidth})`,
      ],
      ['box-shadow', 'none'],
      ['color', 'var(--tinyrack-text, var(--color-base-content))'],
      ['font-family', 'var(--tinyrack-font-mono)'],
      [
        'font-weight',
        `var(--tinyrack-kbd-font-weight, ${tinyrackKbdContract.fontWeight})`,
      ],
      ['justify-content', 'center'],
      ['line-height', '1'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackKbdContract.sizes[size];
      const height = `var(--tinyrack-kbd-height-${size}, ${tokens.height})`;
      const fontSize = `var(--tinyrack-kbd-font-size-${size}, ${tokens.fontSize})`;

      return createBlock(`.kbd-${size}`, [
        ['--size', height],
        ['font-size', fontSize],
        ['height', height],
        ['min-width', height],
      ]);
    }),
  ];

  return blocks.join('\n\n');
}

function createTinyrackDaisyUiSelectionControlParityCss() {
  const selectionSelector = '.checkbox, .radio';
  const checkedSelector =
    '.checkbox:checked, .checkbox[aria-checked="true"], .radio:checked, .radio[aria-checked="true"]';

  const blocks = [
    createBlock(selectionSelector, [
      ['--input-color', 'var(--tinyrack-border, currentColor)'],
      ['background-color', 'var(--tinyrack-surface, transparent)'],
      ['border-color', 'var(--tinyrack-border, currentColor)'],
      [
        'border-width',
        `var(--tinyrack-selection-control-border-width, ${tinyrackSelectionControlContract.borderWidth})`,
      ],
      ['box-shadow', 'none'],
    ]),
    createBlock('.checkbox', [
      [
        'border-radius',
        `var(--tinyrack-selection-control-checkbox-radius, ${tinyrackSelectionControlContract.checkboxRadius})`,
      ],
      ['color', 'var(--tinyrack-primary-contrast, currentColor)'],
    ]),
    createBlock('.radio', [
      [
        'border-radius',
        `var(--tinyrack-selection-control-radio-radius, ${tinyrackSelectionControlContract.radioRadius})`,
      ],
      ['color', 'var(--tinyrack-primary-contrast, currentColor)'],
    ]),
    createBlock('.checkbox-primary, .radio-primary', [
      ['--input-color', 'var(--tinyrack-primary, var(--color-primary))'],
    ]),
    createBlock(checkedSelector, [
      ['--input-color', 'var(--tinyrack-primary, currentColor)'],
      ['background-color', 'var(--tinyrack-primary, currentColor)'],
      ['border-color', 'var(--tinyrack-primary, currentColor)'],
      ['color', 'var(--tinyrack-primary-contrast, currentColor)'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackSelectionControlContract.sizes[size];
      const controlSize = `var(--tinyrack-selection-control-size-${size}, ${tokens.size})`;
      const padding = `var(--tinyrack-selection-control-padding-${size}, ${tokens.padding})`;

      return createBlock(`.checkbox-${size}, .radio-${size}`, [
        ['--size', controlSize],
        ['height', controlSize],
        ['padding', padding],
        ['width', controlSize],
      ]);
    }),
  ];

  return blocks.join('\n\n');
}

function createTinyrackDaisyUiSwitchParityCss() {
  const checkedSelector =
    '.toggle:checked, .toggle[aria-checked="true"], .toggle:has(> input:checked)';

  const blocks = [
    createBlock('.toggle', [
      ['--input-color', 'var(--tinyrack-surface-raised, currentColor)'],
      ['background-color', 'var(--tinyrack-surface, transparent)'],
      ['border-color', 'var(--tinyrack-border, currentColor)'],
      [
        'border-width',
        `var(--tinyrack-switch-border-width, ${tinyrackSwitchContract.borderWidth})`,
      ],
      [
        'border-radius',
        `var(--tinyrack-switch-radius, ${tinyrackSwitchContract.radius})`,
      ],
      ['box-shadow', 'none'],
      ['color', 'var(--tinyrack-surface-raised, currentColor)'],
    ]),
    createBlock(checkedSelector, [
      ['--input-color', 'var(--tinyrack-primary, currentColor)'],
      ['background-color', 'var(--tinyrack-primary, currentColor)'],
      ['border-color', 'var(--tinyrack-primary, currentColor)'],
      ['color', 'var(--tinyrack-primary-contrast, currentColor)'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackSwitchContract.sizes[size];
      const height = `var(--tinyrack-switch-height-${size}, ${tokens.height})`;

      return createBlock(`.toggle-${size}`, [
        ['--size', height],
        ['--toggle-p', `calc(${height} * 0.125)`],
        ['height', height],
        [
          'width',
          `calc((${height} * 2) - (var(--tinyrack-switch-border-width, ${tinyrackSwitchContract.borderWidth}) + var(--toggle-p)) * 2)`,
        ],
      ]);
    }),
  ];

  return blocks.join('\n\n');
}

function createTinyrackDaisyUiSurfaceParityCss() {
  const blocks = [
    createBlock('.alert', [
      ['background-color', 'var(--tinyrack-surface-muted, var(--color-base-200))'],
      ['border-color', 'var(--tinyrack-border, var(--color-base-200))'],
      ['border-radius', 'var(--tinyrack-radius-box, var(--radius-box))'],
      ['box-shadow', 'none'],
      ['color', 'var(--tinyrack-text, var(--color-base-content))'],
      ['font-size', `var(--tinyrack-text-sm, ${tinyrackTypography.fontSize.sm})`],
      [
        'line-height',
        `var(--tinyrack-leading-md, ${tinyrackTypography.lineHeight.md})`,
      ],
      ['padding', `${tinyrackSpacing.md} ${tinyrackSpacing.lg}`],
    ]),
    createBlock('.card', [
      ['background-color', 'var(--tinyrack-surface, var(--color-base-100))'],
      [
        'border',
        'var(--tinyrack-control-border-width, 1px) solid var(--tinyrack-border)',
      ],
      ['border-radius', 'var(--tinyrack-radius-box, var(--radius-box))'],
      ['box-shadow', 'none'],
      ['color', 'var(--tinyrack-text, var(--color-base-content))'],
    ]),
    createBlock('.card-body', [
      ['gap', tinyrackSpacing.sm],
      ['padding', tinyrackSpacing.lg],
    ]),
    createBlock('.divider', [
      ['--divider-color', 'var(--tinyrack-border, var(--color-base-content))'],
      ['color', 'var(--tinyrack-text-muted, var(--color-base-content))'],
      ['font-size', `var(--tinyrack-text-xs, ${tinyrackTypography.fontSize.xs})`],
    ]),
    createBlock('.fieldset', [
      ['background-color', 'var(--tinyrack-surface, var(--color-base-100))'],
      [
        'border',
        'var(--tinyrack-control-border-width, 1px) solid var(--tinyrack-border)',
      ],
      ['border-radius', 'var(--tinyrack-radius-box, var(--radius-box))'],
      ['color', 'var(--tinyrack-text, var(--color-base-content))'],
      ['padding', tinyrackSpacing.lg],
    ]),
    createBlock('.fieldset-legend', [
      ['color', 'var(--tinyrack-text, var(--color-base-content))'],
      ['font-weight', 'var(--tinyrack-control-font-weight, 600)'],
    ]),
    createBlock('.progress', [
      ['background-color', 'var(--tinyrack-surface-muted, var(--color-base-300))'],
      ['border-radius', 'var(--tinyrack-progress-radius, var(--radius-box))'],
      ['color', 'var(--tinyrack-primary, var(--color-primary))'],
      ['height', 'var(--tinyrack-progress-size-md, 0.5rem)'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackProgressContract.sizes[size];

      return createBlock(`.progress-${size}`, [
        ['height', `var(--tinyrack-progress-size-${size}, ${tokens.size})`],
      ]);
    }),
    createBlock('.skeleton', [
      ['background-color', 'var(--tinyrack-surface-muted, var(--color-base-300))'],
      ['border-radius', 'var(--tinyrack-radius-box, var(--radius-box))'],
    ]),
  ];

  return blocks.join('\n\n');
}

function createTinyrackDaisyUiVisualStatusParityCss() {
  const blocks = [
    createBlock('.avatar > div', [
      ['background-color', 'var(--tinyrack-avatar-background, var(--color-base-200))'],
      [
        'border',
        'var(--tinyrack-avatar-border-width, 1px) solid var(--tinyrack-border)',
      ],
      ['border-radius', 'var(--tinyrack-avatar-radius, 9999px)'],
      ['color', 'var(--tinyrack-avatar-color, var(--color-base-content))'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackAvatarContract.sizes[size];
      const avatarSize = `var(--tinyrack-avatar-size-${size}, ${tokens.size})`;

      return createBlock(`.avatar-${size} > div`, [
        ['font-size', `calc(${avatarSize} / 2.5)`],
        ['height', avatarSize],
        ['width', avatarSize],
      ]);
    }),
    createBlock('.indicator .indicator-item', [
      ['align-items', 'center'],
      [
        'background-color',
        'var(--tinyrack-indicator-background, var(--color-primary))',
      ],
      ['border-radius', 'var(--tinyrack-indicator-radius, 9999px)'],
      ['color', 'var(--tinyrack-indicator-color, var(--color-primary-content))'],
      ['display', 'flex'],
      ['font-size', `var(--tinyrack-text-xs, ${tinyrackTypography.fontSize.xs})`],
      ['font-weight', 'var(--tinyrack-control-font-weight, 600)'],
      ['justify-content', 'center'],
      ['line-height', '1'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackIndicatorContract.sizes[size];
      const indicatorSize = `var(--tinyrack-indicator-size-${size}, ${tokens.size})`;

      return createBlock(`.indicator-${size} .indicator-item`, [
        ['height', indicatorSize],
        ['min-width', indicatorSize],
        ['padding-inline', `calc(${indicatorSize} / 3)`],
      ]);
    }),
    createBlock('.loading', [
      ['background-color', 'var(--tinyrack-loader-color, currentColor)'],
      ['color', 'var(--tinyrack-loader-color, currentColor)'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackLoaderContract.sizes[size];
      const loaderSize = `var(--tinyrack-loader-size-${size}, ${tokens.height})`;

      return createBlock(`.loading-${size}`, [
        ['height', loaderSize],
        ['width', loaderSize],
      ]);
    }),
    createBlock('.rating', [
      ['color', 'var(--tinyrack-rating-color, var(--color-primary))'],
    ]),
    createBlock('.rating > *', [
      ['background-color', 'var(--tinyrack-rating-color, var(--color-primary))'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackRatingContract.sizes[size];
      const ratingSize = `var(--tinyrack-rating-size-${size}, ${tokens.height})`;

      return createBlock(`.rating-${size}`, [['--size', ratingSize]]);
    }),
    createBlock('.radial-progress', [
      ['color', 'var(--tinyrack-radial-progress-color, var(--color-primary))'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackRadialProgressContract.sizes[size];

      return createBlock(`.radial-progress-${size}`, [
        ['--size', `var(--tinyrack-radial-progress-size-${size}, ${tokens.size})`],
        [
          '--thickness',
          `var(--tinyrack-radial-progress-thickness-${size}, ${tokens.thickness})`,
        ],
      ]);
    }),
  ];

  return blocks.join('\n\n');
}

function createTinyrackDaisyUiNavigationDataParityCss() {
  const blocks = [
    createBlock('.breadcrumbs', [
      ['color', 'var(--tinyrack-breadcrumbs-color, var(--color-base-content))'],
      [
        'font-size',
        `var(--tinyrack-breadcrumbs-font-size, ${tinyrackTypography.fontSize.sm})`,
      ],
      [
        'line-height',
        `var(--tinyrack-leading-md, ${tinyrackTypography.lineHeight.md})`,
      ],
    ]),
    createBlock('.breadcrumbs > :is(menu, ul, ol) > li > *', [
      ['color', 'inherit'],
      ['gap', `var(--tinyrack-breadcrumbs-gap, ${tinyrackSpacing.sm})`],
    ]),
    createBlock('.breadcrumbs > :is(menu, ul, ol) > li + li::before', [
      ['border-color', 'var(--tinyrack-breadcrumbs-separator-color)'],
      ['color', 'var(--tinyrack-breadcrumbs-separator-color)'],
      ['margin-inline-start', `var(--tinyrack-breadcrumbs-gap, ${tinyrackSpacing.sm})`],
      ['margin-inline-end', `var(--tinyrack-breadcrumbs-gap, ${tinyrackSpacing.sm})`],
      ['opacity', '1'],
    ]),
    createBlock('.list', [
      ['background-color', 'var(--tinyrack-list-background, var(--color-base-100))'],
      [
        'border',
        'var(--tinyrack-control-border-width, 1px) solid var(--tinyrack-list-border-color)',
      ],
      ['border-radius', 'var(--tinyrack-list-radius, var(--radius-box))'],
      ['color', 'var(--tinyrack-list-color, var(--color-base-content))'],
      [
        'font-size',
        `var(--tinyrack-list-font-size, ${tinyrackTypography.fontSize.sm})`,
      ],
      [
        'line-height',
        `var(--tinyrack-list-line-height, ${tinyrackTypography.lineHeight.md})`,
      ],
      ['padding', 'var(--tinyrack-list-gap, 0.5rem)'],
    ]),
    createBlock('.list .list-row', [
      ['border-radius', 'var(--tinyrack-control-radius, var(--radius-field))'],
      ['gap', 'var(--tinyrack-list-gap, 0.5rem)'],
      ['padding', 'var(--tinyrack-list-padding, 0.75rem)'],
    ]),
    createBlock('.list > .list-row:not(:last-child)::after', [
      ['border-color', 'var(--tinyrack-list-divider-color)'],
    ]),
    createBlock('.table', [
      ['--table-border-color', 'var(--tinyrack-table-border-color)'],
      ['--table-hover-color', 'var(--tinyrack-table-hover-color)'],
      ['--table-striped-color', 'var(--tinyrack-table-striped-color)'],
      ['border-color', 'var(--tinyrack-table-border-color)'],
      ['border-radius', 'var(--tinyrack-table-radius, var(--radius-box))'],
      ['color', 'var(--tinyrack-table-color, var(--color-base-content))'],
      [
        'font-size',
        `var(--tinyrack-table-font-size-md, ${tinyrackTableContract.sizes.md.fontSize})`,
      ],
    ]),
    createBlock('.table :where(th, td)', [
      [
        'padding-inline',
        `var(--tinyrack-table-padding-x-md, ${tinyrackTableContract.sizes.md.paddingX})`,
      ],
      [
        'padding-block',
        `var(--tinyrack-table-padding-y-md, ${tinyrackTableContract.sizes.md.paddingY})`,
      ],
    ]),
    createBlock('.table :where(thead, tfoot)', [
      ['color', 'var(--tinyrack-table-header-color, var(--color-base-content))'],
      ['font-weight', 'var(--tinyrack-control-font-weight, 600)'],
    ]),
    createBlock('.table-zebra tbody tr:nth-child(even)', [
      ['background-color', 'var(--tinyrack-table-striped-color)'],
    ]),
    ...tinyrackControlSizeNames.flatMap((size) => {
      const tokens = tinyrackTableContract.sizes[size];

      return [
        createBlock(`.table-${size} :not(thead, tfoot) tr`, [
          ['font-size', `var(--tinyrack-table-font-size-${size}, ${tokens.fontSize})`],
        ]),
        createBlock(`.table-${size} :where(th, td)`, [
          [
            'padding-inline',
            `var(--tinyrack-table-padding-x-${size}, ${tokens.paddingX})`,
          ],
          [
            'padding-block',
            `var(--tinyrack-table-padding-y-${size}, ${tokens.paddingY})`,
          ],
        ]),
      ];
    }),
    createBlock('.tabs', [
      ['color', 'var(--tinyrack-tabs-color, var(--color-base-content))'],
    ]),
    createBlock('.tabs-box', [
      ['background-color', 'var(--tinyrack-tabs-background, var(--color-base-200))'],
      ['border-radius', 'calc(var(--tinyrack-tabs-radius) + 0.25rem)'],
      ['box-shadow', 'none'],
    ]),
    createBlock('.tabs > .tab', [
      ['--tab-bg', 'var(--tinyrack-tabs-active-background)'],
      ['--tab-border-color', 'var(--tinyrack-tabs-border-color)'],
      ['border-radius', 'var(--tinyrack-tabs-radius, var(--radius-field))'],
      ['color', 'var(--tinyrack-tabs-color, var(--color-base-content))'],
      [
        'font-size',
        `var(--tinyrack-tabs-font-size-md, ${tinyrackTabsContract.sizes.md.fontSize})`,
      ],
      [
        'height',
        `var(--tinyrack-tabs-height-md, ${tinyrackTabsContract.sizes.md.height})`,
      ],
      [
        'padding-inline',
        `var(--tinyrack-tabs-padding-x-md, ${tinyrackTabsContract.sizes.md.paddingX})`,
      ],
    ]),
    createBlock(
      '.tabs > .tab:is(.tab-active, [aria-selected="true"], [aria-current="true"], [aria-current="page"])',
      [
        ['background-color', 'var(--tinyrack-tabs-active-background)'],
        ['color', 'var(--tinyrack-tabs-active-color)'],
      ],
    ),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackTabsContract.sizes[size];

      return createBlock(`.tabs-${size}`, [
        ['--tab-height', `var(--tinyrack-tabs-height-${size}, ${tokens.height})`],
        ['--tab-p', `var(--tinyrack-tabs-padding-x-${size}, ${tokens.paddingX})`],
      ]);
    }),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackTabsContract.sizes[size];

      return createBlock(`.tabs-${size} > .tab`, [
        ['font-size', `var(--tinyrack-tabs-font-size-${size}, ${tokens.fontSize})`],
        ['height', `var(--tinyrack-tabs-height-${size}, ${tokens.height})`],
        [
          'padding-inline',
          `var(--tinyrack-tabs-padding-x-${size}, ${tokens.paddingX})`,
        ],
      ]);
    }),
    createBlock('.timeline :where(hr)', [
      [
        'background-color',
        'var(--tinyrack-timeline-line-color, var(--color-base-300))',
      ],
      ['height', 'var(--tinyrack-timeline-line-width, 0.375rem)'],
    ]),
    createBlock('.timeline .timeline-middle', [
      ['color', 'var(--tinyrack-timeline-active-color, var(--color-primary))'],
    ]),
    createBlock('.timeline-box', [
      [
        'background-color',
        'var(--tinyrack-timeline-bullet-background, var(--color-base-100))',
      ],
      [
        'border',
        'var(--tinyrack-control-border-width, 1px) solid var(--tinyrack-timeline-line-color)',
      ],
      ['border-radius', 'var(--tinyrack-radius-box, var(--radius-box))'],
      ['box-shadow', 'none'],
      [
        'font-size',
        `var(--tinyrack-timeline-title-font-size, ${tinyrackTypography.fontSize.sm})`,
      ],
    ]),
    createBlock('.steps', [
      ['color', 'var(--tinyrack-text, var(--color-base-content))'],
      [
        'font-size',
        `var(--tinyrack-stepper-font-size-md, ${tinyrackStepperContract.sizes.md.fontSize})`,
      ],
    ]),
    createBlock('.steps .step', [
      ['--step-bg', 'var(--tinyrack-stepper-inactive-color, var(--color-base-300))'],
      [
        '--step-fg',
        'var(--tinyrack-stepper-inactive-text-color, var(--color-base-content))',
      ],
    ]),
    createBlock('.steps .step::before', [
      [
        'height',
        `var(--tinyrack-stepper-line-width-md, ${tinyrackStepperContract.sizes.md.lineWidth})`,
      ],
    ]),
    createBlock(
      '.steps .step > .step-icon, .steps .step:not(:has(.step-icon))::after',
      [
        [
          'border-radius',
          `var(--tinyrack-stepper-radius, ${tinyrackStepperContract.radius})`,
        ],
        [
          'height',
          `var(--tinyrack-stepper-icon-size-md, ${tinyrackStepperContract.sizes.md.iconSize})`,
        ],
        [
          'width',
          `var(--tinyrack-stepper-icon-size-md, ${tinyrackStepperContract.sizes.md.iconSize})`,
        ],
      ],
    ),
    createBlock('.steps .step-primary', [
      ['--step-bg', 'var(--tinyrack-stepper-active-color, var(--color-primary))'],
      [
        '--step-fg',
        'var(--tinyrack-stepper-active-text-color, var(--color-primary-content))',
      ],
    ]),
    createBlock('.range', [
      ['--range-bg', 'var(--tinyrack-range-track-color, var(--color-base-300))'],
      ['--range-progress', 'var(--tinyrack-range-color, currentColor)'],
      ['--range-thumb', 'var(--tinyrack-range-thumb-color, var(--color-base-100))'],
      [
        '--range-thumb-size',
        `var(--tinyrack-range-thumb-size-md, ${tinyrackRangeContract.sizes.md.thumbSize})`,
      ],
      ['border-radius', 'var(--tinyrack-range-radius, var(--radius-selector))'],
      ['color', 'var(--tinyrack-range-color, var(--color-primary))'],
    ]),
    createBlock('.range:focus-visible', [
      ['outline-color', 'var(--tinyrack-range-focus-color, currentColor)'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackRangeContract.sizes[size];

      return createBlock(`.range-${size}`, [
        [
          '--range-thumb-size',
          `var(--tinyrack-range-thumb-size-${size}, ${tokens.thumbSize})`,
        ],
      ]);
    }),
  ];

  return blocks.join('\n\n');
}

function createTinyrackDaisyUiOverlayParityCss() {
  const menuItemSelector =
    '.menu :where(li:not(.menu-title) > *:not(ul, menu, details, .menu-title, .btn)), .menu :where(li:not(.menu-title) > details > summary:not(.menu-title))';
  const menuActiveSelector =
    '.menu :where(li > *:not(ul, menu, .menu-title, details, .btn):active, li > *:not(ul, menu, .menu-title, details, .btn).menu-active, li > details > summary:active), :where(:not(ul, menu, details, .menu-title, .btn)).menu-active';

  const blocks = [
    createBlock('.menu, .dropdown-content.menu', [
      ['--menu-active-bg', 'var(--tinyrack-menu-active-background)'],
      ['--menu-active-fg', 'var(--tinyrack-menu-active-color)'],
      ['background-color', 'var(--tinyrack-menu-background, var(--color-base-100))'],
      [
        'border',
        'var(--tinyrack-control-border-width, 1px) solid var(--tinyrack-menu-border-color)',
      ],
      ['border-radius', 'var(--tinyrack-menu-radius, var(--radius-box))'],
      ['box-shadow', 'var(--tinyrack-menu-shadow, none)'],
      ['color', 'var(--tinyrack-menu-color, var(--color-base-content))'],
      [
        'font-size',
        `var(--tinyrack-menu-font-size-md, ${tinyrackMenuContract.sizes.md.fontSize})`,
      ],
      ['padding', 'var(--tinyrack-menu-padding, 0.5rem)'],
    ]),
    createBlock(menuItemSelector, [
      ['border-radius', 'var(--tinyrack-menu-item-radius, var(--radius-field))'],
      [
        'padding-inline',
        `var(--tinyrack-menu-padding-x-md, ${tinyrackMenuContract.sizes.md.paddingX})`,
      ],
      [
        'padding-block',
        `var(--tinyrack-menu-padding-y-md, ${tinyrackMenuContract.sizes.md.paddingY})`,
      ],
      [
        'font-size',
        `var(--tinyrack-menu-font-size-md, ${tinyrackMenuContract.sizes.md.fontSize})`,
      ],
    ]),
    createBlock(`${menuItemSelector}:hover, ${menuItemSelector}:focus-visible`, [
      ['background-color', 'var(--tinyrack-menu-hover-background)'],
      ['color', 'var(--tinyrack-menu-color)'],
    ]),
    createBlock(menuActiveSelector, [
      ['background-color', 'var(--tinyrack-menu-active-background)'],
      ['color', 'var(--tinyrack-menu-active-color)'],
    ]),
    createBlock('.menu li:empty, .menu .menu-divider', [
      ['background-color', 'var(--tinyrack-menu-divider-color)'],
    ]),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackMenuContract.sizes[size];

      return createBlock(`.menu-${size}`, [
        ['font-size', `var(--tinyrack-menu-font-size-${size}, ${tokens.fontSize})`],
      ]);
    }),
    ...tinyrackControlSizeNames.map((size) => {
      const tokens = tinyrackMenuContract.sizes[size];

      return createBlock(
        `.menu-${size} :where(li:not(.menu-title) > *:not(ul, menu, details, .menu-title)), .menu-${size} :where(li:not(.menu-title) > details > summary:not(.menu-title))`,
        [
          ['font-size', `var(--tinyrack-menu-font-size-${size}, ${tokens.fontSize})`],
          [
            'padding-inline',
            `var(--tinyrack-menu-padding-x-${size}, ${tokens.paddingX})`,
          ],
          [
            'padding-block',
            `var(--tinyrack-menu-padding-y-${size}, ${tokens.paddingY})`,
          ],
        ],
      );
    }),
    createBlock('.modal.modal-open, .modal[open], .modal:target', [
      ['background-color', 'var(--tinyrack-overlay-scrim-color)'],
    ]),
    createBlock('.modal-box', [
      ['background-color', 'var(--tinyrack-overlay-background, var(--color-base-100))'],
      [
        'border',
        'var(--tinyrack-control-border-width, 1px) solid var(--tinyrack-overlay-border-color)',
      ],
      ['border-radius', 'var(--tinyrack-overlay-radius, var(--radius-box))'],
      ['box-shadow', 'var(--tinyrack-overlay-shadow, none)'],
      ['color', 'var(--tinyrack-overlay-color, var(--color-base-content))'],
      ['padding', 'var(--tinyrack-overlay-padding, 1rem)'],
    ]),
    createBlock('.drawer-side > .drawer-overlay', [
      ['background-color', 'var(--tinyrack-overlay-scrim-color)'],
    ]),
    createBlock('.drawer-side > :not(.drawer-overlay)', [
      ['background-color', 'var(--tinyrack-overlay-background, var(--color-base-100))'],
      [
        'border-inline-end',
        'var(--tinyrack-control-border-width, 1px) solid var(--tinyrack-overlay-border-color)',
      ],
      ['box-shadow', 'var(--tinyrack-overlay-shadow, none)'],
      ['color', 'var(--tinyrack-overlay-color, var(--color-base-content))'],
    ]),
    createBlock('.collapse', [
      ['background-color', 'var(--tinyrack-overlay-background, var(--color-base-100))'],
      [
        'border',
        'var(--tinyrack-control-border-width, 1px) solid var(--tinyrack-overlay-border-color)',
      ],
      ['border-radius', 'var(--tinyrack-overlay-radius, var(--radius-box))'],
      ['color', 'var(--tinyrack-overlay-color, var(--color-base-content))'],
    ]),
    createBlock('.collapse-title', [
      ['font-weight', 'var(--tinyrack-control-font-weight, 600)'],
    ]),
    createBlock('.tooltip', [
      ['--tt-bg', 'var(--tinyrack-tooltip-background, var(--color-primary))'],
    ]),
    createBlock('.tooltip > .tooltip-content, .tooltip[data-tip]::before', [
      ['background-color', 'var(--tinyrack-tooltip-background, var(--color-primary))'],
      ['border-radius', 'var(--tinyrack-tooltip-radius, var(--radius-field))'],
      ['color', 'var(--tinyrack-tooltip-color, var(--color-primary-content))'],
      [
        'font-size',
        `var(--tinyrack-tooltip-font-size, ${tinyrackTypography.fontSize.sm})`,
      ],
      [
        'line-height',
        `var(--tinyrack-tooltip-line-height, ${tinyrackTypography.lineHeight.sm})`,
      ],
      ['padding-inline', `var(--tinyrack-tooltip-padding-x, ${tinyrackSpacing.sm})`],
      ['padding-block', `var(--tinyrack-tooltip-padding-y, ${tinyrackSpacing.xs})`],
    ]),
    createBlock('.tooltip::after', [
      ['background-color', 'var(--tinyrack-tooltip-background, var(--color-primary))'],
    ]),
  ];

  return blocks.join('\n\n');
}

export function createTinyrackDaisyUiThemeCss() {
  return createFile(
    createDaisyUiThemeBlock(tinyrackDaisyUiThemes.light),
    createDaisyUiThemeBlock(tinyrackDaisyUiThemes.dark),
    createTinyrackDaisyUiButtonParityCss(),
    createTinyrackDaisyUiFormControlParityCss(),
    createTinyrackDaisyUiBadgeParityCss(),
    createTinyrackDaisyUiKbdParityCss(),
    createTinyrackDaisyUiSelectionControlParityCss(),
    createTinyrackDaisyUiSwitchParityCss(),
    createTinyrackDaisyUiSurfaceParityCss(),
    createTinyrackDaisyUiVisualStatusParityCss(),
    createTinyrackDaisyUiNavigationDataParityCss(),
    createTinyrackDaisyUiOverlayParityCss(),
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
    createTinyrackDaisyUiButtonParityCss(),
    createTinyrackDaisyUiFormControlParityCss(),
    createTinyrackDaisyUiBadgeParityCss(),
    createTinyrackDaisyUiKbdParityCss(),
    createTinyrackDaisyUiSelectionControlParityCss(),
    createTinyrackDaisyUiSwitchParityCss(),
    createTinyrackDaisyUiSurfaceParityCss(),
    createTinyrackDaisyUiVisualStatusParityCss(),
    createTinyrackDaisyUiNavigationDataParityCss(),
    createTinyrackDaisyUiOverlayParityCss(),
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

function createMantineButtonParityDeclarations(): CssDeclaration[] {
  return [
    ['--button-radius', 'var(--tinyrack-control-radius)'],
    ['font-weight', 'var(--tinyrack-control-font-weight)'],
    ...tinyrackControlSizeNames.flatMap((size) => [
      [`--button-height-${size}`, `var(--tinyrack-control-height-${size})`] as const,
      [
        `--button-padding-x-${size}`,
        `var(--tinyrack-control-padding-x-${size})`,
      ] as const,
      [
        `--mantine-font-size-${size}`,
        `var(--tinyrack-control-font-size-${size})`,
      ] as const,
    ]),
  ];
}

function createMantineFormControlParityDeclarations(): CssDeclaration[] {
  return [
    ['--input-bg', 'var(--tinyrack-surface)'],
    ['--input-bd', 'var(--tinyrack-border)'],
    ['--input-bd-focus', 'var(--tinyrack-focus)'],
    ['--input-color', 'var(--tinyrack-text)'],
    ['--input-placeholder-color', 'var(--tinyrack-text-muted)'],
    ['--input-radius', 'var(--tinyrack-control-radius)'],
    ...tinyrackControlSizeNames.flatMap((size) => [
      [`--input-height-${size}`, `var(--tinyrack-control-height-${size})`] as const,
      [
        `--input-padding-y-${size}`,
        `var(--tinyrack-control-padding-y-${size})`,
      ] as const,
      [
        `--mantine-font-size-${size}`,
        `var(--tinyrack-control-font-size-${size})`,
      ] as const,
    ]),
  ];
}

function createMantineBadgeParityDeclarations(): CssDeclaration[] {
  return [
    ['--badge-border-width', 'var(--tinyrack-badge-border-width)'],
    ['--badge-radius', 'var(--tinyrack-badge-radius)'],
    ['font-weight', 'var(--tinyrack-badge-font-weight)'],
    ['letter-spacing', '0'],
    ['text-transform', 'none'],
    ...tinyrackControlSizeNames.flatMap((size) => [
      [`--badge-height-${size}`, `var(--tinyrack-badge-height-${size})`] as const,
      [`--badge-fz-${size}`, `var(--tinyrack-badge-font-size-${size})`] as const,
      [
        `--badge-padding-x-${size}`,
        `calc(var(--tinyrack-badge-height-${size}) / 2 - var(--tinyrack-badge-border-width))`,
      ] as const,
    ]),
  ];
}

function createMantineKbdParityDeclarations(): CssDeclaration[] {
  return [
    ['align-items', 'center'],
    ['background-color', 'var(--tinyrack-kbd-background)'],
    ['border-color', 'var(--tinyrack-border)'],
    ['border-bottom-color', 'var(--tinyrack-border-strong)'],
    ['border-radius', 'var(--tinyrack-kbd-radius)'],
    ['border-width', 'var(--tinyrack-kbd-border-width)'],
    ['border-bottom-width', 'var(--tinyrack-kbd-border-bottom-width)'],
    ['box-shadow', 'none'],
    ['color', 'var(--tinyrack-text)'],
    ['display', 'inline-flex'],
    ['font-family', 'var(--tinyrack-font-mono)'],
    ['font-weight', 'var(--tinyrack-kbd-font-weight)'],
    ['justify-content', 'center'],
    ['line-height', '1'],
    ...tinyrackControlSizeNames.map(
      (size) => [`--kbd-fz-${size}`, `var(--tinyrack-kbd-font-size-${size})`] as const,
    ),
  ];
}

function createMantineCheckboxParityDeclarations(): CssDeclaration[] {
  return [
    ['--checkbox-radius', 'var(--tinyrack-selection-control-checkbox-radius)'],
    ['--checkbox-color', 'var(--tinyrack-primary)'],
    ['--checkbox-icon-color', 'var(--tinyrack-primary-contrast)'],
    ...tinyrackControlSizeNames.map(
      (size) =>
        [
          `--checkbox-size-${size}`,
          `var(--tinyrack-selection-control-size-${size})`,
        ] as const,
    ),
  ];
}

function createMantineRadioParityDeclarations(): CssDeclaration[] {
  return [
    ['--radio-radius', 'var(--tinyrack-selection-control-radio-radius)'],
    ['--radio-color', 'var(--tinyrack-primary)'],
    ['--radio-icon-color', 'var(--tinyrack-primary-contrast)'],
    ...tinyrackControlSizeNames.flatMap((size) => [
      [
        `--radio-size-${size}`,
        `var(--tinyrack-selection-control-size-${size})`,
      ] as const,
      [
        `--radio-icon-size-${size}`,
        `calc(var(--tinyrack-selection-control-size-${size}) - var(--tinyrack-selection-control-padding-${size}) * 2)`,
      ] as const,
    ]),
  ];
}

function createMantineSelectionInputParityDeclarations(): CssDeclaration[] {
  return [
    ['background-color', 'var(--tinyrack-surface)'],
    ['border-color', 'var(--tinyrack-border)'],
    ['border-width', 'var(--tinyrack-selection-control-border-width)'],
    ['box-shadow', 'none'],
  ];
}

function createMantineCheckedSelectionInputParityDeclarations(): CssDeclaration[] {
  return [
    ['background-color', 'var(--tinyrack-primary)'],
    ['border-color', 'var(--tinyrack-primary)'],
  ];
}

function createMantineSwitchParityDeclarations(): CssDeclaration[] {
  return [
    ['--switch-radius', 'var(--tinyrack-switch-radius)'],
    ['--switch-color', 'var(--tinyrack-primary)'],
    ...tinyrackControlSizeNames.flatMap((size) => [
      [`--switch-height-${size}`, `var(--tinyrack-switch-height-${size})`] as const,
      [
        `--switch-width-${size}`,
        `calc((var(--tinyrack-switch-height-${size}) * 2) - (var(--tinyrack-switch-border-width) + var(--tinyrack-switch-height-${size}) * 0.125) * 2)`,
      ] as const,
      [
        `--switch-thumb-size-${size}`,
        `calc(var(--tinyrack-switch-height-${size}) - (var(--tinyrack-switch-border-width) + var(--tinyrack-switch-height-${size}) * 0.125) * 2)`,
      ] as const,
      [
        `--switch-track-label-padding-${size}`,
        `calc(var(--tinyrack-switch-height-${size}) * 0.125)`,
      ] as const,
    ]),
  ];
}

function createMantineSurfaceParityDeclarations(): CssDeclaration[] {
  return [
    ['background-color', 'var(--tinyrack-surface)'],
    ['border', 'var(--tinyrack-control-border-width) solid var(--tinyrack-border)'],
    ['border-radius', 'var(--tinyrack-radius-box)'],
    ['box-shadow', 'none'],
    ['color', 'var(--tinyrack-text)'],
  ];
}

function createMantineAlertParityDeclarations(): CssDeclaration[] {
  return [
    ['--alert-bg', 'var(--tinyrack-surface-muted)'],
    ['--alert-bd', 'var(--tinyrack-control-border-width) solid var(--tinyrack-border)'],
    ['--alert-color', 'var(--tinyrack-text)'],
    ['--alert-radius', 'var(--tinyrack-radius-box)'],
    ['background-color', 'var(--tinyrack-surface-muted)'],
    ['border', 'var(--tinyrack-control-border-width) solid var(--tinyrack-border)'],
    ['box-shadow', 'none'],
    ['color', 'var(--tinyrack-text)'],
    ['font-size', `var(--tinyrack-text-sm, ${tinyrackTypography.fontSize.sm})`],
    ['line-height', `var(--tinyrack-leading-md, ${tinyrackTypography.lineHeight.md})`],
    ['padding', `${tinyrackSpacing.md} ${tinyrackSpacing.lg}`],
  ];
}

function createMantineProgressParityDeclarations(): CssDeclaration[] {
  return [
    ['--progress-radius', 'var(--tinyrack-progress-radius)'],
    ...tinyrackControlSizeNames.map(
      (size) =>
        [`--progress-size-${size}`, `var(--tinyrack-progress-size-${size})`] as const,
    ),
  ];
}

function createMantineAvatarParityDeclarations(): CssDeclaration[] {
  return [
    ['--avatar-bg', 'var(--tinyrack-avatar-background)'],
    ['--avatar-bd', 'var(--tinyrack-avatar-border-width) solid var(--tinyrack-border)'],
    ['--avatar-color', 'var(--tinyrack-avatar-color)'],
    ['--avatar-radius', 'var(--tinyrack-avatar-radius)'],
    ['background-color', 'var(--tinyrack-avatar-background)'],
    ['color', 'var(--tinyrack-avatar-color)'],
    ...tinyrackControlSizeNames.map(
      (size) =>
        [`--avatar-size-${size}`, `var(--tinyrack-avatar-size-${size})`] as const,
    ),
  ];
}

function createMantineIndicatorParityDeclarations(): CssDeclaration[] {
  return [
    ['--indicator-color', 'var(--tinyrack-indicator-background)'],
    ['--indicator-radius', 'var(--tinyrack-indicator-radius)'],
    ['--indicator-text-color', 'var(--tinyrack-indicator-color)'],
    ['background-color', 'var(--tinyrack-indicator-background)'],
    ['color', 'var(--tinyrack-indicator-color)'],
    ['font-weight', 'var(--tinyrack-control-font-weight)'],
  ];
}

function createMantineLoaderParityDeclarations(): CssDeclaration[] {
  return [
    ['--loader-color', 'var(--tinyrack-loader-color)'],
    ['color', 'var(--tinyrack-loader-color)'],
    ...tinyrackControlSizeNames.map(
      (size) =>
        [`--loader-size-${size}`, `var(--tinyrack-loader-size-${size})`] as const,
    ),
  ];
}

function createMantineRatingParityDeclarations(): CssDeclaration[] {
  return [
    ['--rating-color', 'var(--tinyrack-rating-color)'],
    ...tinyrackControlSizeNames.map(
      (size) =>
        [`--rating-size-${size}`, `var(--tinyrack-rating-size-${size})`] as const,
    ),
  ];
}

function createMantineRadialProgressParityDeclarations(): CssDeclaration[] {
  return [
    ['--rp-curve-root-color', 'var(--tinyrack-radial-progress-empty-color)'],
    ['--scp-empty-segment-color', 'var(--tinyrack-radial-progress-empty-color)'],
    ['--scp-filled-segment-color', 'var(--tinyrack-radial-progress-color)'],
  ];
}

function createMantineBreadcrumbsParityDeclarations(): CssDeclaration[] {
  return [
    ['color', 'var(--tinyrack-breadcrumbs-color)'],
    ['font-size', 'var(--tinyrack-breadcrumbs-font-size)'],
    ['line-height', `var(--tinyrack-leading-md, ${tinyrackTypography.lineHeight.md})`],
  ];
}

function createMantineListParityDeclarations(): CssDeclaration[] {
  return [
    ['background-color', 'var(--tinyrack-list-background)'],
    [
      'border',
      'var(--tinyrack-control-border-width) solid var(--tinyrack-list-border-color)',
    ],
    ['border-radius', 'var(--tinyrack-list-radius)'],
    ['color', 'var(--tinyrack-list-color)'],
    ['display', 'flex'],
    ['flex-direction', 'column'],
    ['font-size', 'var(--tinyrack-list-font-size)'],
    ['line-height', 'var(--tinyrack-list-line-height)'],
    ['list-style', 'none'],
    ['margin', '0'],
    ['padding', 'var(--tinyrack-list-gap)'],
  ];
}

function createMantineTableParityDeclarations(): CssDeclaration[] {
  return [
    ['--table-border-color', 'var(--tinyrack-table-border-color)'],
    ['--table-hover-color', 'var(--tinyrack-table-hover-color)'],
    ['--table-striped-color', 'var(--tinyrack-table-striped-color)'],
    ['border-color', 'var(--tinyrack-table-border-color)'],
    ['border-radius', 'var(--tinyrack-table-radius)'],
    ['color', 'var(--tinyrack-table-color)'],
    ['font-size', 'var(--tinyrack-table-font-size-md)'],
    ['overflow', 'hidden'],
    ['--table-horizontal-spacing', 'var(--tinyrack-table-padding-x-md)'],
    ['--table-vertical-spacing', 'var(--tinyrack-table-padding-y-md)'],
  ];
}

function createMantineTabsParityDeclarations(): CssDeclaration[] {
  return [
    ['--tab-border-color', 'var(--tinyrack-tabs-border-color)'],
    ['--tab-hover-color', 'var(--tinyrack-tabs-background)'],
    ['--tabs-color', 'var(--tinyrack-tabs-active-color)'],
    ['--tabs-radius', 'var(--tinyrack-tabs-radius)'],
    ['--tabs-text-color', 'var(--tinyrack-tabs-active-color)'],
    ['color', 'var(--tinyrack-tabs-color)'],
  ];
}

function createMantineTimelineParityDeclarations(): CssDeclaration[] {
  return [
    ['--tl-bullet-size', 'var(--tinyrack-timeline-bullet-size)'],
    ['--tl-color', 'var(--tinyrack-timeline-active-color)'],
    ['--tl-line-width', 'var(--tinyrack-timeline-line-width)'],
    ['--tl-radius', 'var(--tinyrack-timeline-radius)'],
  ];
}

function createMantineStepperParityDeclarations(): CssDeclaration[] {
  return [
    ['--stepper-color', 'var(--tinyrack-stepper-active-color)'],
    ['--stepper-icon-color', 'var(--tinyrack-stepper-active-text-color)'],
    ['--stepper-outline-color', 'var(--tinyrack-stepper-inactive-color)'],
    ['--stepper-radius', 'var(--tinyrack-stepper-radius)'],
    ...tinyrackControlSizeNames.flatMap((size) => [
      [
        `--stepper-icon-size-${size}`,
        `var(--tinyrack-stepper-icon-size-${size})`,
      ] as const,
      [`--stepper-fz-${size}`, `var(--tinyrack-stepper-font-size-${size})`] as const,
      [`--stepper-spacing-${size}`, `var(--tinyrack-stepper-spacing-${size})`] as const,
    ]),
  ];
}

function createMantineRangeParityDeclarations(): CssDeclaration[] {
  return [
    ['--slider-color', 'var(--tinyrack-range-color)'],
    ['--slider-radius', 'var(--tinyrack-range-radius)'],
    ['--slider-track-bg', 'var(--tinyrack-range-track-color)'],
    ['--slider-thumb-color', 'var(--tinyrack-range-thumb-color)'],
    ...tinyrackControlSizeNames.flatMap((size) => [
      [`--slider-size-${size}`, `var(--tinyrack-range-track-size-${size})`] as const,
      [
        `--slider-thumb-size-${size}`,
        `var(--tinyrack-range-thumb-size-${size})`,
      ] as const,
    ]),
  ];
}

function createMantineMenuParityDeclarations(): CssDeclaration[] {
  return [
    ['background-color', 'var(--tinyrack-menu-background)'],
    [
      'border',
      'var(--tinyrack-control-border-width) solid var(--tinyrack-menu-border-color)',
    ],
    ['border-radius', 'var(--tinyrack-menu-radius)'],
    ['box-shadow', 'var(--tinyrack-menu-shadow)'],
    ['color', 'var(--tinyrack-menu-color)'],
    ['font-size', 'var(--tinyrack-menu-font-size-md)'],
    ['padding', 'var(--tinyrack-menu-padding)'],
  ];
}

function createMantineOverlaySurfaceDeclarations(): CssDeclaration[] {
  return [
    ['background-color', 'var(--tinyrack-overlay-background)'],
    [
      'border',
      'var(--tinyrack-control-border-width) solid var(--tinyrack-overlay-border-color)',
    ],
    ['border-radius', 'var(--tinyrack-overlay-radius)'],
    ['box-shadow', 'var(--tinyrack-overlay-shadow)'],
    ['color', 'var(--tinyrack-overlay-color)'],
  ];
}

function createMantineTooltipParityDeclarations(): CssDeclaration[] {
  return [
    ['background-color', 'var(--tinyrack-tooltip-background)'],
    ['border-radius', 'var(--tinyrack-tooltip-radius)'],
    ['color', 'var(--tinyrack-tooltip-color)'],
    ['font-size', 'var(--tinyrack-tooltip-font-size)'],
    ['line-height', 'var(--tinyrack-tooltip-line-height)'],
    ['padding-inline', 'var(--tinyrack-tooltip-padding-x)'],
    ['padding-block', 'var(--tinyrack-tooltip-padding-y)'],
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
    createBlock(
      '[data-mantine-color-scheme] .mantine-Button-root',
      createMantineButtonParityDeclarations(),
    ),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Input-wrapper',
      createMantineFormControlParityDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Input-input', [
      ...createMantineFormControlParityDeclarations(),
      ['box-shadow', 'none'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Badge-root',
      createMantineBadgeParityDeclarations(),
    ),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Kbd-root',
      createMantineKbdParityDeclarations(),
    ),
    ...tinyrackControlSizeNames.map((size) =>
      createBlock(
        `[data-mantine-color-scheme] .mantine-Kbd-root[data-size="${size}"]`,
        [
          ['font-size', `var(--tinyrack-kbd-font-size-${size})`],
          ['height', `var(--tinyrack-kbd-height-${size})`],
          ['min-width', `var(--tinyrack-kbd-height-${size})`],
        ],
      ),
    ),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Checkbox-root',
      createMantineCheckboxParityDeclarations(),
    ),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Radio-root',
      createMantineRadioParityDeclarations(),
    ),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Checkbox-input, [data-mantine-color-scheme] .mantine-Radio-radio',
      createMantineSelectionInputParityDeclarations(),
    ),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Checkbox-input:checked, [data-mantine-color-scheme] .mantine-Checkbox-input[data-indeterminate], [data-mantine-color-scheme] .mantine-Radio-radio:checked',
      createMantineCheckedSelectionInputParityDeclarations(),
    ),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Switch-root',
      createMantineSwitchParityDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Switch-track', [
      ['--switch-bg', 'var(--tinyrack-surface)'],
      ['border', 'var(--tinyrack-switch-border-width) solid var(--tinyrack-border)'],
      ['box-shadow', 'none'],
      ['color', 'var(--tinyrack-surface-raised)'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Switch-thumb', [
      ['--switch-thumb-bg', 'var(--tinyrack-surface-raised)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Switch-input:checked + .mantine-Switch-track',
      [
        ['--switch-bg', 'var(--tinyrack-primary)'],
        ['border-color', 'var(--tinyrack-primary)'],
        ['color', 'var(--tinyrack-primary-contrast)'],
      ],
    ),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Switch-input:checked + * > .mantine-Switch-thumb',
      [['--switch-thumb-bg', 'var(--tinyrack-primary-contrast)']],
    ),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Avatar-root',
      createMantineAvatarParityDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Avatar-placeholder', [
      ['background-color', 'var(--tinyrack-avatar-background)'],
      ['border', 'var(--tinyrack-avatar-border-width) solid var(--tinyrack-border)'],
      ['color', 'var(--tinyrack-avatar-color)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Indicator-indicator',
      createMantineIndicatorParityDeclarations(),
    ),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Loader-root',
      createMantineLoaderParityDeclarations(),
    ),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Rating-root',
      createMantineRatingParityDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Rating-starSymbol', [
      ['fill', 'var(--tinyrack-rating-empty-color)'],
      ['stroke', 'var(--tinyrack-rating-empty-color)'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Rating-starSymbol[data-filled]', [
      ['fill', 'var(--tinyrack-rating-color)'],
      ['stroke', 'var(--tinyrack-rating-color)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Alert-root',
      createMantineAlertParityDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Alert-message', [
      ['color', 'var(--tinyrack-text)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Card-root',
      createMantineSurfaceParityDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Card-root', [
      ['--card-padding', tinyrackSpacing.lg],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Divider-root', [
      ['--divider-color', 'var(--tinyrack-border)'],
      ['color', 'var(--tinyrack-text-muted)'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Divider-label', [
      ['color', 'var(--tinyrack-text-muted)'],
      ['font-size', `var(--tinyrack-text-xs, ${tinyrackTypography.fontSize.xs})`],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Fieldset-root',
      createMantineSurfaceParityDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Fieldset-legend', [
      ['color', 'var(--tinyrack-text)'],
      ['font-weight', 'var(--tinyrack-control-font-weight)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Progress-root',
      createMantineProgressParityDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Progress-root', [
      ['background-color', 'var(--tinyrack-surface-muted)'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Progress-section', [
      ['background-color', 'var(--tinyrack-primary)'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Skeleton-root', [
      ['background-color', 'var(--tinyrack-surface-muted)'],
      ['border-radius', 'var(--tinyrack-radius-box)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Skeleton-root[data-visible]::after',
      [['background-color', 'var(--tinyrack-surface-muted)']],
    ),
    createBlock(
      '[data-mantine-color-scheme] .mantine-RingProgress-root, [data-mantine-color-scheme] .mantine-RingProgress-curve, [data-mantine-color-scheme] .mantine-SemiCircleProgress-root',
      createMantineRadialProgressParityDeclarations(),
    ),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Breadcrumbs-root',
      createMantineBreadcrumbsParityDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Breadcrumbs-breadcrumb', [
      ['color', 'inherit'],
      ['gap', 'var(--tinyrack-breadcrumbs-gap)'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Breadcrumbs-separator', [
      ['color', 'var(--tinyrack-breadcrumbs-separator-color)'],
      ['margin-inline', 'var(--tinyrack-breadcrumbs-gap)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-List-root',
      createMantineListParityDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-List-item', [
      ['border-radius', 'var(--tinyrack-control-radius)'],
      ['list-style', 'none'],
      ['padding', 'var(--tinyrack-list-padding)'],
      ['position', 'relative'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-List-item:not(:last-of-type)', [
      [
        'border-bottom',
        'var(--tinyrack-control-border-width) solid var(--tinyrack-list-divider-color)',
      ],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Table-table',
      createMantineTableParityDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Table-th', [
      ['color', 'var(--tinyrack-table-header-color)'],
      ['font-weight', 'var(--tinyrack-control-font-weight)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Table-td, [data-mantine-color-scheme] .mantine-Table-th',
      [
        ['padding-inline', 'var(--tinyrack-table-padding-x-md)'],
        ['padding-block', 'var(--tinyrack-table-padding-y-md)'],
      ],
    ),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Tabs-root',
      createMantineTabsParityDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Tabs-list', [
      ['background-color', 'var(--tinyrack-tabs-background)'],
      ['border-radius', 'calc(var(--tinyrack-tabs-radius) + 0.25rem)'],
      ['padding', '0.25rem'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Tabs-tab', [
      ['border-radius', 'var(--tinyrack-tabs-radius)'],
      ['color', 'var(--tinyrack-tabs-color)'],
      ['font-size', 'var(--tinyrack-tabs-font-size-md)'],
      ['height', 'var(--tinyrack-tabs-height-md)'],
      ['padding-inline', 'var(--tinyrack-tabs-padding-x-md)'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Tabs-tab[data-active]', [
      ['background-color', 'var(--tinyrack-tabs-active-background)'],
      ['color', 'var(--tinyrack-tabs-active-color)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Timeline-root',
      createMantineTimelineParityDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Timeline-item', [
      ['--item-border-color', 'var(--tinyrack-timeline-line-color)'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Timeline-itemBullet', [
      ['background-color', 'var(--tinyrack-timeline-bullet-background)'],
      ['border-color', 'var(--tinyrack-timeline-line-color)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Timeline-itemBullet[data-active]',
      [
        ['background-color', 'var(--tinyrack-timeline-active-color)'],
        ['border-color', 'var(--tinyrack-timeline-active-color)'],
        ['color', 'var(--tinyrack-primary-contrast)'],
      ],
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Timeline-itemTitle', [
      ['font-size', 'var(--tinyrack-timeline-title-font-size)'],
      ['font-weight', 'var(--tinyrack-timeline-title-font-weight)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Stepper-root',
      createMantineStepperParityDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Stepper-separator', [
      ['background-color', 'var(--tinyrack-stepper-inactive-color)'],
      ['height', 'var(--tinyrack-stepper-line-width-md)'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Stepper-separator[data-active]', [
      ['background-color', 'var(--tinyrack-stepper-active-color)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Stepper-stepIcon:not([data-completed])',
      [
        ['background-color', 'var(--tinyrack-stepper-inactive-color)'],
        ['border-color', 'var(--tinyrack-stepper-inactive-color)'],
        ['color', 'var(--tinyrack-stepper-inactive-text-color)'],
      ],
    ),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Stepper-stepIcon[data-completed]',
      [
        ['background-color', 'var(--tinyrack-stepper-active-color)'],
        ['border-color', 'var(--tinyrack-stepper-active-color)'],
        ['color', 'var(--tinyrack-stepper-active-text-color)'],
      ],
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Stepper-stepLabel', [
      ['font-weight', 'var(--tinyrack-control-font-weight)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Slider-root',
      createMantineRangeParityDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Slider-track', [
      ['background-color', 'var(--tinyrack-range-track-color)'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Slider-bar', [
      ['background-color', 'var(--tinyrack-range-color)'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Slider-thumb', [
      ['background-color', 'var(--tinyrack-range-thumb-color)'],
      ['border-color', 'var(--tinyrack-range-color)'],
      ['color', 'var(--tinyrack-range-color)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Menu-dropdown',
      createMantineMenuParityDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Menu-item', [
      ['border-radius', 'var(--tinyrack-menu-item-radius)'],
      ['color', 'var(--tinyrack-menu-color)'],
      ['font-size', 'var(--tinyrack-menu-font-size-md)'],
      ['padding-inline', 'var(--tinyrack-menu-padding-x-md)'],
      ['padding-block', 'var(--tinyrack-menu-padding-y-md)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Menu-item:where(:hover, :focus, [data-hovered], [data-menu-active])',
      [
        ['background-color', 'var(--tinyrack-menu-hover-background)'],
        ['color', 'var(--tinyrack-menu-color)'],
      ],
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Menu-item[data-active]', [
      ['background-color', 'var(--tinyrack-menu-active-background)'],
      ['color', 'var(--tinyrack-menu-active-color)'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Menu-label', [
      ['color', 'var(--tinyrack-text-muted)'],
      ['font-size', `var(--tinyrack-text-xs, ${tinyrackTypography.fontSize.xs})`],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Menu-divider', [
      ['border-color', 'var(--tinyrack-menu-divider-color)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Modal-content',
      createMantineOverlaySurfaceDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Modal-header', [
      ['background-color', 'var(--tinyrack-overlay-background)'],
      [
        'border-bottom',
        'var(--tinyrack-control-border-width) solid var(--tinyrack-overlay-border-color)',
      ],
      ['border-start-start-radius', 'var(--tinyrack-overlay-radius)'],
      ['border-start-end-radius', 'var(--tinyrack-overlay-radius)'],
      ['color', 'var(--tinyrack-overlay-color)'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Modal-body', [
      ['padding', 'var(--tinyrack-overlay-padding)'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Modal-overlay', [
      ['background-color', 'var(--tinyrack-overlay-scrim-color)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Drawer-content',
      createMantineOverlaySurfaceDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Drawer-header', [
      ['background-color', 'var(--tinyrack-overlay-background)'],
      [
        'border-bottom',
        'var(--tinyrack-control-border-width) solid var(--tinyrack-overlay-border-color)',
      ],
      ['color', 'var(--tinyrack-overlay-color)'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Drawer-body', [
      ['padding', 'var(--tinyrack-overlay-padding)'],
    ]),
    createBlock('[data-mantine-color-scheme] .mantine-Drawer-overlay', [
      ['background-color', 'var(--tinyrack-overlay-scrim-color)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-Tooltip-tooltip',
      createMantineTooltipParityDeclarations(),
    ),
    createBlock('[data-mantine-color-scheme] .mantine-Tooltip-arrow', [
      ['background-color', 'var(--tinyrack-tooltip-background)'],
    ]),
    createBlock('.mantine-focus-auto:focus-visible', [
      ['outline-color', 'var(--mantine-primary-color-filled)'],
    ]),
    createBlock(
      '[data-mantine-color-scheme] .mantine-SegmentedControl-label:not([data-active]):not([data-disabled]) .mantine-SegmentedControl-innerLabel',
      [['color', 'var(--tinyrack-text) !important']],
    ),
    createBlock(
      '[data-mantine-color-scheme] .mantine-SegmentedControl-label[data-active] .mantine-SegmentedControl-innerLabel',
      [['color', 'var(--tinyrack-mantine-filled-color) !important']],
    ),
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
