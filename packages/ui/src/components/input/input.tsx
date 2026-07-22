'use client';

import { Input as BaseInput } from '@base-ui/react/input';
import type { ComponentPropsWithRef } from 'react';
import type { TRControlUiSize } from '../../core/tokens/control-metrics.js';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRInputUiSize = TRControlUiSize;
export type TRInputProps = ComponentPropsWithRef<typeof BaseInput> & {
  uiSize?: TRInputUiSize;
};

export function TRInput({ className, uiSize = 'md', ...props }: TRInputProps) {
  return (
    <BaseInput
      {...props}
      className={mergeComponentClassName('tr-input', className)}
      data-ui-size={uiSize}
    />
  );
}
