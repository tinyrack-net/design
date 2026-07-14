'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SliderIndicatorProps = ComponentProps<typeof BaseSlider.Indicator>;
export const SliderIndicator = createComponentPart(
  BaseSlider.Indicator,
  'tr-slider-indicator',
);
