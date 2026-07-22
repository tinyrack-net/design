import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRSpinnerUiSize = 'sm' | 'md' | 'lg';
export type TRSpinnerVariant = 'current' | 'muted' | 'primary' | 'danger';
export type TRSpinnerProps = Omit<
  ComponentProps<'span'>,
  'aria-hidden' | 'aria-label' | 'children' | 'role'
> & {
  decorative?: boolean;
  label?: string;
  uiSize?: TRSpinnerUiSize;
  variant?: TRSpinnerVariant;
};

export function TRSpinner({
  className,
  decorative = false,
  label = 'Loading',
  uiSize = 'md',
  variant = 'current',
  ...props
}: TRSpinnerProps) {
  const accessibleLabel = label.trim() === '' ? 'Loading' : label;
  const spinnerProps = {
    ...props,
    className: mergeClassNames('tr-spinner', className),
    'data-ui-size': uiSize,
    'data-variant': variant,
  };

  if (decorative) {
    return <span {...spinnerProps} aria-hidden="true" />;
  }

  return <span {...spinnerProps} aria-label={accessibleLabel} role="status" />;
}
