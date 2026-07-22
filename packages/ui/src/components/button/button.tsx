'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import type { ComponentProps } from 'react';
import type { TRControlUiSize } from '../../core/tokens/control-metrics.js';
import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { TRSpinner } from '../spinner/index.js';

export type TRButtonAppearance = 'solid' | 'outline' | 'ghost';
export type TRButtonIntent =
  | 'neutral'
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';
export type TRButtonUiSize = TRControlUiSize;
export type TRButtonVariant = 'secondary' | 'primary' | 'danger';
export type TRButtonProps = ComponentProps<typeof BaseButton> & {
  appearance?: TRButtonAppearance;
  intent?: TRButtonIntent;
  loading?: boolean;
  loadingLabel?: string;
  uiSize?: TRButtonUiSize;
  /** @deprecated Use `intent`. `secondary` maps to `neutral`. */
  variant?: TRButtonVariant;
};

const legacyVariantIntents = {
  danger: 'danger',
  primary: 'primary',
  secondary: 'neutral',
} as const satisfies Record<TRButtonVariant, TRButtonIntent>;

export function TRButton({
  'aria-busy': ariaBusy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  appearance = 'solid',
  children,
  className,
  disabled,
  intent,
  loading = false,
  loadingLabel,
  nativeButton = true,
  uiSize = 'md',
  type = 'button',
  variant = 'secondary',
  ...props
}: TRButtonProps) {
  const resolvedIntent = intent ?? legacyVariantIntents[variant];

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
      data-intent={resolvedIntent}
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
