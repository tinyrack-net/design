'use client';

import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import type { ComponentProps } from 'react';
import type { TRControlUiSize } from '../../core/tokens/control-metrics.js';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TROTPFieldRootProps = ComponentProps<typeof BaseOTPField.Root> & {
  uiSize?: TRControlUiSize;
};

export function TROTPFieldRoot({
  className,
  uiSize = 'md',
  ...props
}: TROTPFieldRootProps) {
  return (
    <BaseOTPField.Root
      {...props}
      className={mergeComponentClassName('tr-otp-field', className)}
      data-ui-size={uiSize}
    />
  );
}
