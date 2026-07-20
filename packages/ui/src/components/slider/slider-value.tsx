'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSliderValueProps = ComponentProps<typeof BaseSlider.Value>;
export const TRSliderValue = createComponentPart(BaseSlider.Value, 'tr-slider-value');
