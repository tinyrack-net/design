'use client';

import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import type { ComponentProps } from 'react';
import type { TRFieldAppearance } from '../../core/field-appearance.js';
import type { TRControlUiSize } from '../../core/tokens.js';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TROTPFieldRootProps = ComponentProps<typeof BaseOTPField.Root> & {
  uiSize?: TRControlUiSize;
  appearance?: TRFieldAppearance;
};

export function TROTPFieldRoot({
  appearance = 'solid',
  className,
  uiSize = 'md',
  ...props
}: TROTPFieldRootProps) {
  return (
    <BaseOTPField.Root
      {...props}
      className={mergeComponentClassName('tr-otp-field', className)}
      data-appearance={appearance}
      data-ui-size={uiSize}
    />
  );
}
