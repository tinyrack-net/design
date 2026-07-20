'use client';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import type { ComponentPropsWithRef } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRCheckboxUiSize = 'sm' | 'md' | 'lg';
export type TRCheckboxRootProps = ComponentPropsWithRef<typeof BaseCheckbox.Root> & {
  uiSize?: TRCheckboxUiSize;
};

export function TRCheckboxRoot({
  className,
  uiSize = 'md',
  ...props
}: TRCheckboxRootProps) {
  return (
    <BaseCheckbox.Root
      {...props}
      className={mergeComponentClassName('tr-checkbox', className)}
      data-ui-size={uiSize}
    />
  );
}
