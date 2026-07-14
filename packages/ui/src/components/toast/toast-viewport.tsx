'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type ToastPosition =
  | 'block-start-inline-start'
  | 'block-start-center'
  | 'block-start-inline-end'
  | 'block-end-inline-start'
  | 'block-end-center'
  | 'block-end-inline-end';
export type ToastViewportProps = ComponentProps<typeof BaseToast.Viewport> & {
  position?: ToastPosition;
};

export function ToastViewport({
  className,
  position = 'block-end-inline-end',
  ...props
}: ToastViewportProps) {
  return (
    <BaseToast.Viewport
      {...props}
      className={mergeComponentClassName('tr-toast-viewport', className)}
      data-position={position}
    />
  );
}
