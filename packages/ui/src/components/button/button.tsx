'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { Spinner } from '../spinner/index.js';

export type ButtonAppearance = 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonVariant = 'secondary' | 'primary' | 'danger';
export type ButtonProps = ComponentProps<typeof BaseButton> & {
  appearance?: ButtonAppearance;
  loading?: boolean;
  loadingLabel?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function Button({
  appearance = 'solid',
  children,
  className,
  disabled,
  loading = false,
  loadingLabel,
  size = 'md',
  type = 'button',
  variant = 'secondary',
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      {...props}
      aria-busy={loading || undefined}
      aria-label={loading ? (loadingLabel ?? props['aria-label']) : props['aria-label']}
      className={mergeComponentClassName('tr-btn', className)}
      data-appearance={appearance}
      data-size={size}
      data-variant={variant}
      disabled={disabled || loading}
      type={type}
    >
      {loading ? <Spinner decorative size="sm" /> : null}
      {children}
    </BaseButton>
  );
}
