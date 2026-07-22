'use client';

import { Slider as BaseSlider, type SliderRoot } from '@base-ui/react/slider';
import type { Ref } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRSliderUiSize = 'sm' | 'md' | 'lg';
export type TRSliderRootProps<
  Value extends number | readonly number[] = number | readonly number[],
> = SliderRoot.Props<Value> & {
  ref?: Ref<HTMLDivElement>;
  uiSize?: TRSliderUiSize;
};

export function TRSliderRoot<Value extends number | readonly number[]>({
  className,
  uiSize = 'md',
  ...props
}: TRSliderRootProps<Value>) {
  return (
    <BaseSlider.Root
      {...props}
      className={mergeComponentClassName('tr-slider', className)}
      data-ui-size={uiSize}
    />
  );
}
