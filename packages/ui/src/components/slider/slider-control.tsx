'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSliderControlProps = ComponentProps<typeof BaseSlider.Control>;
export const TRSliderControl = createComponentPart(
  BaseSlider.Control,
  'tr-slider-control',
);
