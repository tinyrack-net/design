import { tinyrackSpacing } from './spacing.js';
import { tinyrackTypography } from './typography.js';

export const tinyrackControlSizeNames = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export type TinyrackControlSize = (typeof tinyrackControlSizeNames)[number];

export type TinyrackCompactComponentSize = TinyrackControlSize;

export type TinyrackControlSizeTokens = {
  gap: string;
  height: string;
  iconSize: string;
  paddingX: string;
  paddingY: string;
  fontSize: string;
};

export type TinyrackCompactComponentSizeTokens = {
  height: string;
  fontSize: string;
};

export type TinyrackSelectionControlSizeTokens = {
  padding: string;
  size: string;
};

export type TinyrackProgressSizeTokens = {
  size: string;
};

export type TinyrackAvatarSizeTokens = {
  size: string;
};

export type TinyrackIndicatorSizeTokens = {
  size: string;
};

export type TinyrackRadialProgressSizeTokens = {
  size: string;
  thickness: string;
};

export type TinyrackTableSizeTokens = {
  fontSize: string;
  paddingX: string;
  paddingY: string;
};

export type TinyrackTabsSizeTokens = {
  fontSize: string;
  height: string;
  paddingX: string;
};

export type TinyrackRangeSizeTokens = {
  thumbSize: string;
  trackSize: string;
};

export type TinyrackStepperSizeTokens = {
  fontSize: string;
  iconSize: string;
  lineWidth: string;
  spacing: string;
};

export type TinyrackMenuSizeTokens = {
  fontSize: string;
  paddingX: string;
  paddingY: string;
};

export const tinyrackControlSizes = {
  xs: {
    gap: '0.25rem',
    height: '1.5rem',
    iconSize: '0.875rem',
    paddingX: '0.5rem',
    paddingY: '0.25rem',
    fontSize: '0.6875rem',
  },
  sm: {
    gap: '0.375rem',
    height: '2rem',
    iconSize: '1rem',
    paddingX: '0.75rem',
    paddingY: '0.375rem',
    fontSize: '0.75rem',
  },
  md: {
    gap: '0.5rem',
    height: '2.5rem',
    iconSize: '1.125rem',
    paddingX: '1rem',
    paddingY: '0.5rem',
    fontSize: '0.875rem',
  },
  lg: {
    gap: '0.625rem',
    height: '3rem',
    iconSize: '1.25rem',
    paddingX: '1.25rem',
    paddingY: '0.625rem',
    fontSize: '1rem',
  },
  xl: {
    gap: '0.75rem',
    height: '3.5rem',
    iconSize: '1.5rem',
    paddingX: '1.5rem',
    paddingY: '0.75rem',
    fontSize: '1.125rem',
  },
} as const satisfies Record<TinyrackControlSize, TinyrackControlSizeTokens>;

export const tinyrackCompactComponentSizes = {
  xs: {
    height: '1rem',
    fontSize: '0.625rem',
  },
  sm: {
    height: '1.25rem',
    fontSize: '0.75rem',
  },
  md: {
    height: '1.5rem',
    fontSize: '0.875rem',
  },
  lg: {
    height: '1.75rem',
    fontSize: '1rem',
  },
  xl: {
    height: '2rem',
    fontSize: '1.125rem',
  },
} as const satisfies Record<
  TinyrackCompactComponentSize,
  TinyrackCompactComponentSizeTokens
>;

export const tinyrackSelectionControlSizes = {
  xs: {
    padding: '0.125rem',
    size: tinyrackCompactComponentSizes.xs.height,
  },
  sm: {
    padding: '0.1875rem',
    size: tinyrackCompactComponentSizes.sm.height,
  },
  md: {
    padding: '0.25rem',
    size: tinyrackCompactComponentSizes.md.height,
  },
  lg: {
    padding: '0.3125rem',
    size: tinyrackCompactComponentSizes.lg.height,
  },
  xl: {
    padding: '0.375rem',
    size: tinyrackCompactComponentSizes.xl.height,
  },
} as const satisfies Record<
  TinyrackCompactComponentSize,
  TinyrackSelectionControlSizeTokens
>;

export const tinyrackProgressSizes = {
  xs: {
    size: '0.25rem',
  },
  sm: {
    size: '0.375rem',
  },
  md: {
    size: '0.5rem',
  },
  lg: {
    size: '0.75rem',
  },
  xl: {
    size: '1rem',
  },
} as const satisfies Record<TinyrackCompactComponentSize, TinyrackProgressSizeTokens>;

export const tinyrackAvatarSizes = {
  xs: {
    size: tinyrackControlSizes.xs.height,
  },
  sm: {
    size: tinyrackControlSizes.sm.height,
  },
  md: {
    size: tinyrackControlSizes.md.height,
  },
  lg: {
    size: tinyrackControlSizes.lg.height,
  },
  xl: {
    size: tinyrackControlSizes.xl.height,
  },
} as const satisfies Record<TinyrackCompactComponentSize, TinyrackAvatarSizeTokens>;

export const tinyrackIndicatorSizes = {
  xs: {
    size: '0.5rem',
  },
  sm: {
    size: '0.625rem',
  },
  md: {
    size: '0.75rem',
  },
  lg: {
    size: '0.875rem',
  },
  xl: {
    size: '1rem',
  },
} as const satisfies Record<TinyrackCompactComponentSize, TinyrackIndicatorSizeTokens>;

export const tinyrackRadialProgressSizes = {
  xs: {
    size: '3rem',
    thickness: '0.3rem',
  },
  sm: {
    size: '4rem',
    thickness: '0.4rem',
  },
  md: {
    size: '5rem',
    thickness: '0.5rem',
  },
  lg: {
    size: '6rem',
    thickness: '0.6rem',
  },
  xl: {
    size: '7rem',
    thickness: '0.7rem',
  },
} as const satisfies Record<
  TinyrackCompactComponentSize,
  TinyrackRadialProgressSizeTokens
>;

export const tinyrackTableSizes = {
  xs: {
    fontSize: tinyrackControlSizes.xs.fontSize,
    paddingX: tinyrackControlSizes.xs.paddingX,
    paddingY: tinyrackControlSizes.xs.paddingY,
  },
  sm: {
    fontSize: tinyrackControlSizes.sm.fontSize,
    paddingX: tinyrackControlSizes.sm.paddingX,
    paddingY: tinyrackControlSizes.sm.paddingY,
  },
  md: {
    fontSize: tinyrackControlSizes.md.fontSize,
    paddingX: tinyrackControlSizes.md.paddingX,
    paddingY: tinyrackControlSizes.md.paddingY,
  },
  lg: {
    fontSize: tinyrackControlSizes.lg.fontSize,
    paddingX: tinyrackControlSizes.lg.paddingX,
    paddingY: tinyrackControlSizes.lg.paddingY,
  },
  xl: {
    fontSize: tinyrackControlSizes.xl.fontSize,
    paddingX: tinyrackControlSizes.xl.paddingX,
    paddingY: tinyrackControlSizes.xl.paddingY,
  },
} as const satisfies Record<TinyrackControlSize, TinyrackTableSizeTokens>;

export const tinyrackTabsSizes = {
  xs: {
    fontSize: tinyrackControlSizes.xs.fontSize,
    height: tinyrackControlSizes.xs.height,
    paddingX: tinyrackControlSizes.xs.paddingX,
  },
  sm: {
    fontSize: tinyrackControlSizes.sm.fontSize,
    height: tinyrackControlSizes.sm.height,
    paddingX: tinyrackControlSizes.sm.paddingX,
  },
  md: {
    fontSize: tinyrackControlSizes.md.fontSize,
    height: tinyrackControlSizes.md.height,
    paddingX: tinyrackControlSizes.md.paddingX,
  },
  lg: {
    fontSize: tinyrackControlSizes.lg.fontSize,
    height: tinyrackControlSizes.lg.height,
    paddingX: tinyrackControlSizes.lg.paddingX,
  },
  xl: {
    fontSize: tinyrackControlSizes.xl.fontSize,
    height: tinyrackControlSizes.xl.height,
    paddingX: tinyrackControlSizes.xl.paddingX,
  },
} as const satisfies Record<TinyrackControlSize, TinyrackTabsSizeTokens>;

export const tinyrackRangeSizes = {
  xs: {
    thumbSize: tinyrackSelectionControlSizes.xs.size,
    trackSize: '0.5rem',
  },
  sm: {
    thumbSize: tinyrackSelectionControlSizes.sm.size,
    trackSize: '0.625rem',
  },
  md: {
    thumbSize: tinyrackSelectionControlSizes.md.size,
    trackSize: '0.75rem',
  },
  lg: {
    thumbSize: tinyrackSelectionControlSizes.lg.size,
    trackSize: '0.875rem',
  },
  xl: {
    thumbSize: tinyrackSelectionControlSizes.xl.size,
    trackSize: '1rem',
  },
} as const satisfies Record<TinyrackControlSize, TinyrackRangeSizeTokens>;

export const tinyrackStepperSizes = {
  xs: {
    fontSize: tinyrackControlSizes.xs.fontSize,
    iconSize: tinyrackControlSizes.xs.height,
    lineWidth: tinyrackProgressSizes.xs.size,
    spacing: tinyrackSpacing.xs,
  },
  sm: {
    fontSize: tinyrackControlSizes.sm.fontSize,
    iconSize: tinyrackControlSizes.sm.height,
    lineWidth: tinyrackProgressSizes.sm.size,
    spacing: tinyrackSpacing.sm,
  },
  md: {
    fontSize: tinyrackControlSizes.md.fontSize,
    iconSize: tinyrackControlSizes.md.height,
    lineWidth: tinyrackProgressSizes.md.size,
    spacing: tinyrackSpacing.md,
  },
  lg: {
    fontSize: tinyrackControlSizes.lg.fontSize,
    iconSize: tinyrackControlSizes.lg.height,
    lineWidth: tinyrackProgressSizes.lg.size,
    spacing: tinyrackSpacing.lg,
  },
  xl: {
    fontSize: tinyrackControlSizes.xl.fontSize,
    iconSize: tinyrackControlSizes.xl.height,
    lineWidth: tinyrackProgressSizes.xl.size,
    spacing: tinyrackSpacing.xl,
  },
} as const satisfies Record<TinyrackControlSize, TinyrackStepperSizeTokens>;

export const tinyrackMenuSizes = {
  xs: {
    fontSize: tinyrackControlSizes.xs.fontSize,
    paddingX: '0.5rem',
    paddingY: '0.25rem',
  },
  sm: {
    fontSize: tinyrackControlSizes.sm.fontSize,
    paddingX: '0.625rem',
    paddingY: '0.25rem',
  },
  md: {
    fontSize: tinyrackControlSizes.md.fontSize,
    paddingX: '0.75rem',
    paddingY: '0.375rem',
  },
  lg: {
    fontSize: tinyrackControlSizes.lg.fontSize,
    paddingX: '1rem',
    paddingY: '0.375rem',
  },
  xl: {
    fontSize: tinyrackControlSizes.xl.fontSize,
    paddingX: '1.25rem',
    paddingY: '0.375rem',
  },
} as const satisfies Record<TinyrackControlSize, TinyrackMenuSizeTokens>;

export const tinyrackControlContract = {
  borderWidth: '1px',
  fontWeight: '600',
  radius: '0.25rem',
  sizes: tinyrackControlSizes,
} as const;

export const tinyrackBadgeContract = {
  borderWidth: '1px',
  fontWeight: '600',
  radius: tinyrackControlContract.radius,
  sizes: tinyrackCompactComponentSizes,
} as const;

export const tinyrackAvatarContract = {
  background: 'var(--tinyrack-surface-muted)',
  borderWidth: tinyrackControlContract.borderWidth,
  color: 'var(--tinyrack-text)',
  radius: '9999px',
  sizes: tinyrackAvatarSizes,
} as const;

export const tinyrackIndicatorContract = {
  background: 'var(--tinyrack-primary)',
  color: 'var(--tinyrack-primary-contrast)',
  radius: '9999px',
  sizes: tinyrackIndicatorSizes,
} as const;

export const tinyrackKbdContract = {
  background: 'var(--tinyrack-surface-muted)',
  borderBottomWidth: '2px',
  borderWidth: '1px',
  fontWeight: '600',
  radius: tinyrackControlContract.radius,
  sizes: tinyrackCompactComponentSizes,
} as const;

export const tinyrackSelectionControlContract = {
  borderWidth: tinyrackControlContract.borderWidth,
  checkboxRadius: tinyrackControlContract.radius,
  radioRadius: '9999px',
  sizes: tinyrackSelectionControlSizes,
} as const;

export const tinyrackProgressContract = {
  radius: tinyrackControlContract.radius,
  sizes: tinyrackProgressSizes,
} as const;

export const tinyrackLoaderContract = {
  color: 'var(--tinyrack-primary)',
  sizes: tinyrackCompactComponentSizes,
} as const;

export const tinyrackRatingContract = {
  color: 'var(--tinyrack-primary)',
  emptyColor: 'var(--tinyrack-surface-muted)',
  sizes: tinyrackCompactComponentSizes,
} as const;

export const tinyrackRadialProgressContract = {
  color: 'var(--tinyrack-primary)',
  emptyColor: 'var(--tinyrack-surface-muted)',
  sizes: tinyrackRadialProgressSizes,
} as const;

export const tinyrackBreadcrumbsContract = {
  color: 'var(--tinyrack-text-muted)',
  fontSize: tinyrackTypography.fontSize.sm,
  gap: tinyrackSpacing.sm,
  separatorColor: 'var(--tinyrack-border-strong)',
} as const;

export const tinyrackListContract = {
  background: 'var(--tinyrack-surface)',
  borderColor: 'var(--tinyrack-border)',
  color: 'var(--tinyrack-text)',
  dividerColor: 'var(--tinyrack-border-subtle)',
  fontSize: tinyrackTypography.fontSize.sm,
  gap: tinyrackSpacing.xs,
  lineHeight: tinyrackTypography.lineHeight.md,
  padding: tinyrackSpacing.md,
  radius: 'var(--tinyrack-radius-box)',
} as const;

export const tinyrackTableContract = {
  borderColor: 'var(--tinyrack-border)',
  color: 'var(--tinyrack-text)',
  headerColor: 'var(--tinyrack-text-muted)',
  hoverColor: 'var(--tinyrack-surface-raised)',
  radius: 'var(--tinyrack-radius-box)',
  stripedColor: 'var(--tinyrack-surface-muted)',
  sizes: tinyrackTableSizes,
} as const;

export const tinyrackTabsContract = {
  activeBackground: 'var(--tinyrack-surface)',
  activeColor: 'var(--tinyrack-text)',
  background: 'var(--tinyrack-surface-muted)',
  borderColor: 'var(--tinyrack-border)',
  color: 'var(--tinyrack-text-muted)',
  radius: 'var(--tinyrack-control-radius)',
  sizes: tinyrackTabsSizes,
} as const;

export const tinyrackTimelineContract = {
  activeColor: 'var(--tinyrack-primary)',
  bulletBackground: 'var(--tinyrack-surface)',
  bulletSize: tinyrackControlSizes.sm.height,
  lineColor: 'var(--tinyrack-border)',
  lineWidth: tinyrackProgressSizes.sm.size,
  radius: '9999px',
  titleFontSize: tinyrackTypography.fontSize.sm,
  titleFontWeight: tinyrackControlContract.fontWeight,
} as const;

export const tinyrackStepperContract = {
  activeColor: 'var(--tinyrack-primary)',
  activeTextColor: 'var(--tinyrack-primary-contrast)',
  inactiveColor: 'var(--tinyrack-surface-muted)',
  inactiveTextColor: 'var(--tinyrack-text-muted)',
  radius: '9999px',
  sizes: tinyrackStepperSizes,
} as const;

export const tinyrackRangeContract = {
  color: 'var(--tinyrack-primary)',
  focusColor: 'var(--tinyrack-focus)',
  radius: tinyrackControlContract.radius,
  thumbColor: 'var(--tinyrack-surface)',
  trackColor: 'var(--tinyrack-surface-muted)',
  sizes: tinyrackRangeSizes,
} as const;

export const tinyrackMenuContract = {
  activeBackground: 'var(--tinyrack-primary)',
  activeColor: 'var(--tinyrack-primary-contrast)',
  background: 'var(--tinyrack-surface)',
  borderColor: 'var(--tinyrack-border)',
  color: 'var(--tinyrack-text)',
  dividerColor: 'var(--tinyrack-border-subtle)',
  hoverBackground: 'var(--tinyrack-surface-muted)',
  itemRadius: tinyrackControlContract.radius,
  padding: tinyrackSpacing.xs,
  radius: 'var(--tinyrack-radius-box)',
  shadow: 'none',
  sizes: tinyrackMenuSizes,
} as const;

export const tinyrackOverlayContract = {
  background: 'var(--tinyrack-surface)',
  borderColor: 'var(--tinyrack-border)',
  color: 'var(--tinyrack-text)',
  overlayColor: 'rgb(0 0 0 / 0.4)',
  padding: tinyrackSpacing.lg,
  radius: 'var(--tinyrack-radius-box)',
  shadow: 'none',
} as const;

export const tinyrackTooltipContract = {
  background: 'var(--tinyrack-primary)',
  color: 'var(--tinyrack-primary-contrast)',
  fontSize: tinyrackTypography.fontSize.sm,
  lineHeight: tinyrackTypography.lineHeight.sm,
  paddingX: tinyrackSpacing.sm,
  paddingY: tinyrackSpacing.xs,
  radius: tinyrackControlContract.radius,
} as const;

export const tinyrackSwitchContract = {
  borderWidth: tinyrackControlContract.borderWidth,
  radius: '9999px',
  sizes: tinyrackCompactComponentSizes,
} as const;

export const tinyrackComponentTokens = {
  avatar: tinyrackAvatarContract,
  badge: tinyrackBadgeContract,
  breadcrumbs: tinyrackBreadcrumbsContract,
  control: tinyrackControlContract,
  indicator: tinyrackIndicatorContract,
  kbd: tinyrackKbdContract,
  list: tinyrackListContract,
  loader: tinyrackLoaderContract,
  menu: tinyrackMenuContract,
  overlay: tinyrackOverlayContract,
  progress: tinyrackProgressContract,
  radialProgress: tinyrackRadialProgressContract,
  range: tinyrackRangeContract,
  rating: tinyrackRatingContract,
  selectionControl: tinyrackSelectionControlContract,
  stepper: tinyrackStepperContract,
  switch: tinyrackSwitchContract,
  table: tinyrackTableContract,
  tabs: tinyrackTabsContract,
  timeline: tinyrackTimelineContract,
  tooltip: tinyrackTooltipContract,
} as const;
