import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'current' | 'muted' | 'primary' | 'danger';
export type SpinnerProps = Omit<ComponentProps<'span'>, 'aria-label' | 'role'> & {
  decorative?: boolean;
  label?: string;
  size?: SpinnerSize;
  variant?: SpinnerVariant;
};

export function Spinner({
  className,
  decorative = false,
  label = 'Loading',
  size = 'md',
  variant = 'current',
  ...props
}: SpinnerProps) {
  const spinnerProps = {
    ...props,
    className: mergeClassNames('tr-spinner', className),
    'data-size': size,
    'data-variant': variant,
  };

  if (decorative) {
    return <span {...spinnerProps} aria-hidden="true" />;
  }

  return <span {...spinnerProps} aria-label={label} role="status" />;
}
