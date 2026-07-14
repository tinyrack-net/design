'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SliderThumbProps = ComponentProps<typeof BaseSlider.Thumb>;
export const SliderThumb = createComponentPart(BaseSlider.Thumb, 'tr-slider-thumb');
