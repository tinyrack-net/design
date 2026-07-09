import { forwardRef, type HTMLAttributes } from 'react';
import {
  type BadgeSize,
  type BadgeVariant,
  badgeClassName,
  badgeContract,
} from './contract.js';

export type { BadgeSize, BadgeVariant } from './contract.js';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  size?: BadgeSize;
  variant?: BadgeVariant;
};

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    className,
    size = badgeContract.defaultSize,
    variant = badgeContract.defaultVariant,
    ...badgeProps
  },
  ref,
) {
  return (
    <span
      {...badgeProps}
      className={mergeClassNames(badgeClassName, className)}
      data-size={size}
      data-variant={variant}
      ref={ref}
    />
  );
});
