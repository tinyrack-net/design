'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps } from 'react';
import type { TRControlUiSize } from '../../core/tokens/control-metrics.js';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRFieldControlProps = ComponentProps<typeof BaseField.Control> & {
  uiSize?: TRControlUiSize;
};

export function TRFieldControl({
  className,
  uiSize = 'md',
  ...props
}: TRFieldControlProps) {
  return (
    <BaseField.Control
      {...props}
      className={mergeComponentClassName('tr-field-control', className)}
      data-ui-size={uiSize}
    />
  );
}
