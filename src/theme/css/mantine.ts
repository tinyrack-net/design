import { tinyrackPalettes } from '../colors.js';
import { tinyrackControlSizeNames } from '../components.js';
import { tinyrackSemanticColors } from '../semantic.js';
import { tinyrackSpacing } from '../spacing.js';
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
  type SemanticMode,
} from './tinyrack-declarations.js';

const mantineColorSchemeSelectors = [
  '[data-mantine-color-scheme="light"]',
  '[data-mantine-color-scheme="dark"]',
] as const;

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
