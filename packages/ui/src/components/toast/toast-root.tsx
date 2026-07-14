'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type ToastVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type ToastRootProps = ComponentProps<typeof BaseToast.Root> & {
  variant?: ToastVariant | undefined;
};

export function ToastRoot({ className, toast, variant, ...props }: ToastRootProps) {
  const resolvedVariant =
    variant ?? (toast.type as ToastVariant | undefined) ?? 'neutral';

  return (
    <BaseToast.Root
      {...props}
      className={mergeComponentClassName('tr-toast', className)}
      data-variant={resolvedVariant}
      toast={toast}
    />
  );
}
