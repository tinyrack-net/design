'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import type { ComponentPropsWithRef } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRSliderUiSize = 'sm' | 'md' | 'lg';
export type TRSliderRootProps = ComponentPropsWithRef<typeof BaseSlider.Root> & {
  uiSize?: TRSliderUiSize;
};

export function TRSliderRoot({
  className,
  uiSize = 'md',
  ...props
}: TRSliderRootProps) {
  return (
    <BaseSlider.Root
      {...props}
      className={mergeComponentClassName('tr-slider', className)}
      data-ui-size={uiSize}
    />
  );
}
