'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRToastVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type TRToastRootProps = ComponentProps<typeof BaseToast.Root> & {
  variant?: TRToastVariant | undefined;
};

export function TRToastRoot({ className, toast, variant, ...props }: TRToastRootProps) {
  const resolvedVariant =
    variant ?? (toast.type as TRToastVariant | undefined) ?? 'neutral';

  return (
    <BaseToast.Root
      {...props}
      className={mergeComponentClassName('tr-toast', className)}
      data-variant={resolvedVariant}
      toast={toast}
    />
  );
}
