'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SliderValueProps = ComponentProps<typeof BaseSlider.Value>;
export const SliderValue = createComponentPart(BaseSlider.Value, 'tr-slider-value');
