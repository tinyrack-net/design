'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRToastPosition =
  | 'block-start-inline-start'
  | 'block-start-center'
  | 'block-start-inline-end'
  | 'block-end-inline-start'
  | 'block-end-center'
  | 'block-end-inline-end';
export type TRToastViewportProps = ComponentProps<typeof BaseToast.Viewport> & {
  position?: TRToastPosition;
};

export function TRToastViewport({
  className,
  position = 'block-end-inline-end',
  ...props
}: TRToastViewportProps) {
  return (
    <BaseToast.Viewport
      {...props}
      className={mergeComponentClassName(
        'tr-layer-viewport tr-toast-viewport',
        className,
      )}
      data-position={position}
    />
  );
}
