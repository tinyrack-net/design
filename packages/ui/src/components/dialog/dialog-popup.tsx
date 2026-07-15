'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type DialogPlacement = 'middle' | 'top' | 'bottom' | 'start' | 'end';
type BaseDialogPopupProps = Omit<ComponentProps<typeof BaseDialog.Popup>, 'size'>;
export type DialogPopupProps = BaseDialogPopupProps & {
  placement?: DialogPlacement;
};

export function DialogPopup({
  className,
  placement = 'middle',
  ...props
}: DialogPopupProps) {
  return (
    <BaseDialog.Popup
      {...props}
      className={mergeComponentClassName('tr-dialog tr-dialog-box', className)}
      data-placement={placement}
    />
  );
}
