'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SliderLabelProps = ComponentProps<typeof BaseSlider.Label>;
export const SliderLabel = createComponentPart(BaseSlider.Label, 'tr-slider-label');
