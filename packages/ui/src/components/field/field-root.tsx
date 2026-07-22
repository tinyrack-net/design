'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps } from 'react';
import type { TRControlUiSize } from '../../core/tokens/control-metrics.js';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRFieldUiSize = TRControlUiSize;
export type TRFieldRootProps = ComponentProps<typeof BaseField.Root> & {
  uiSize?: TRFieldUiSize;
};

export function TRFieldRoot({ className, uiSize = 'md', ...props }: TRFieldRootProps) {
  return (
    <BaseField.Root
      {...props}
      className={mergeComponentClassName('tr-field', className)}
      data-ui-size={uiSize}
    />
  );
}
