'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { TRSpinner } from '../spinner/index.js';

export type TRButtonAppearance = 'solid' | 'outline' | 'ghost';
export type TRButtonUiSize = 'sm' | 'md' | 'lg';
export type TRButtonVariant = 'secondary' | 'primary' | 'danger';
export type TRButtonProps = ComponentProps<typeof BaseButton> & {
  appearance?: TRButtonAppearance;
  loading?: boolean;
  loadingLabel?: string;
  uiSize?: TRButtonUiSize;
  variant?: TRButtonVariant;
};

export function TRButton({
  'aria-busy': ariaBusy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  appearance = 'solid',
  children,
  className,
  disabled,
  loading = false,
  loadingLabel,
  nativeButton = true,
  uiSize = 'md',
  type = 'button',
  variant = 'secondary',
  ...props
}: TRButtonProps) {
  return (
    <BaseButton
      {...props}
      aria-busy={loading ? true : ariaBusy}
      aria-label={loading ? (loadingLabel ?? ariaLabel) : ariaLabel}
      aria-labelledby={
        loading && loadingLabel !== undefined ? undefined : ariaLabelledBy
      }
      className={mergeComponentClassName('tr-btn', className)}
      data-appearance={appearance}
      data-ui-size={uiSize}
      data-variant={variant}
      disabled={disabled || loading}
      nativeButton={nativeButton}
      type={nativeButton ? type : undefined}
    >
      {loading ? <TRSpinner decorative uiSize="sm" /> : null}
      {children}
    </BaseButton>
  );
}
