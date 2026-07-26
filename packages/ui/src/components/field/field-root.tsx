'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRFieldRootProps = ComponentProps<typeof BaseField.Root>;

export function TRFieldRoot({ className, ...props }: TRFieldRootProps) {
  return (
    <BaseField.Root
      {...props}
      className={mergeComponentClassName('tr-field', className)}
    />
  );
}
