'use client';

import { Radio as BaseRadio } from '@base-ui/react/radio';
import type { ComponentPropsWithRef } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRRadioUiSize = 'sm' | 'md' | 'lg';
export type TRRadioRootProps = ComponentPropsWithRef<typeof BaseRadio.Root> & {
  uiSize?: TRRadioUiSize;
};

export function TRRadioRoot({ className, uiSize = 'md', ...props }: TRRadioRootProps) {
  return (
    <BaseRadio.Root
      {...props}
      className={mergeComponentClassName('tr-radio', className)}
      data-ui-size={uiSize}
    />
  );
}
