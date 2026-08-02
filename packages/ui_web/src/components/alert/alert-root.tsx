import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRAlertRootProps = ComponentProps<'div'> & {
  variant?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
};

export function TRAlertRoot({
  className,
  variant = 'neutral',
  ...props
}: TRAlertRootProps) {
  return (
    <div
      {...props}
      className={mergeClassNames('tr-alert', className)}
      data-variant={variant}
    />
  );
}
