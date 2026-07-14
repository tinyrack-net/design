import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type BadgeProps = ComponentProps<'span'> & {
  size?: BadgeSize;
  variant?: BadgeVariant;
};

export function Badge({
  className,
  size = 'md',
  variant = 'neutral',
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={mergeClassNames('tr-badge', className)}
      data-size={size}
      data-variant={variant}
    />
  );
}
