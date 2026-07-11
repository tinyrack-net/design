export const badgeClassName = 'tr-badge';
export const badgeSizes = ['sm', 'md'] as const;
export const badgeVariants = [
  'neutral',
  'info',
  'success',
  'warning',
  'danger',
] as const;

export type BadgeSize = (typeof badgeSizes)[number];
export type BadgeVariant = (typeof badgeVariants)[number];

export const badgeContract = {
  defaultSize: 'sm',
  defaultVariant: 'neutral',
} as const satisfies {
  defaultSize: BadgeSize;
  defaultVariant: BadgeVariant;
};
