'use client';

import { Progress as BaseProgress } from '@base-ui/react/progress';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRProgressUiSize = 'sm' | 'md' | 'lg';
export type TRProgressVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type TRProgressRootProps = ComponentProps<typeof BaseProgress.Root> & {
  uiSize?: TRProgressUiSize;
  variant?: TRProgressVariant;
};

export function TRProgressRoot({
  className,
  uiSize = 'md',
  variant = 'neutral',
  ...props
}: TRProgressRootProps) {
  return (
    <BaseProgress.Root
      {...props}
      className={mergeComponentClassName('tr-progress', className)}
      data-ui-size={uiSize}
      data-variant={variant}
    />
  );
}
