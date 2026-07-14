'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type DialogPlacement = 'middle' | 'top' | 'bottom' | 'start' | 'end';
export type DialogSize = 'sm' | 'md' | 'lg' | 'full';
export type DialogPopupProps = ComponentProps<typeof BaseDialog.Popup> & {
  placement?: DialogPlacement;
  size?: DialogSize;
};

export function DialogPopup({
  className,
  placement = 'middle',
  size = 'md',
  ...props
}: DialogPopupProps) {
  return (
    <BaseDialog.Popup
      {...props}
      className={mergeComponentClassName('tr-dialog tr-dialog-box', className)}
      data-placement={placement}
      data-size={size}
    />
  );
}
