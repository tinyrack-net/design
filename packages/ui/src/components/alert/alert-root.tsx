import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type AlertRootProps = ComponentProps<'div'> & {
  variant?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
};

export function AlertRoot({
  className,
  variant = 'neutral',
  ...props
}: AlertRootProps) {
  return (
    <div
      {...props}
      className={mergeClassNames('tr-alert', className)}
      data-variant={variant}
    />
  );
}
