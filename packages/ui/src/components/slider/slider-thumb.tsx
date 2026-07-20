'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSliderThumbProps = ComponentProps<typeof BaseSlider.Thumb>;
export const TRSliderThumb = createComponentPart(BaseSlider.Thumb, 'tr-slider-thumb');
