import { tinyrackPalettes } from '../colors.js';
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
} from '../components.js';
import { tinyrackRadii } from '../radii.js';
import { tinyrackSemanticColors } from '../semantic.js';
import { tinyrackTypography } from '../typography.js';
import { type CssDeclaration, createWrappedFontStack } from './render.js';

export type SemanticMode = keyof typeof tinyrackSemanticColors;

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

export function createSemanticDeclarations(mode: SemanticMode): CssDeclaration[] {
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

export function createBaseDeclarations(): CssDeclaration[] {
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
