'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSliderLabelProps = ComponentProps<typeof BaseSlider.Label>;
export const TRSliderLabel = createComponentPart(BaseSlider.Label, 'tr-slider-label');
