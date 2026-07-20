'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRDialogPlacement = 'middle' | 'top' | 'bottom' | 'start' | 'end';
type BaseDialogPopupProps = Omit<ComponentProps<typeof BaseDialog.Popup>, 'size'>;
export type TRDialogPopupProps = BaseDialogPopupProps & {
  placement?: TRDialogPlacement;
};

export function TRDialogPopup({
  className,
  placement = 'middle',
  ...props
}: TRDialogPopupProps) {
  return (
    <BaseDialog.Popup
      {...props}
      className={mergeComponentClassName('tr-dialog tr-dialog-box', className)}
      data-placement={placement}
    />
  );
}
