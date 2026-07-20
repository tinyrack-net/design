import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRBadgeUiSize = 'sm' | 'md' | 'lg';
export type TRBadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type TRBadgeProps = ComponentProps<'span'> & {
  uiSize?: TRBadgeUiSize;
  variant?: TRBadgeVariant;
};

export function TRBadge({
  className,
  uiSize = 'md',
  variant = 'neutral',
  ...props
}: TRBadgeProps) {
  return (
    <span
      {...props}
      className={mergeClassNames('tr-badge', className)}
      data-ui-size={uiSize}
      data-variant={variant}
    />
  );
}
