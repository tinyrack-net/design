'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SliderTrackProps = ComponentProps<typeof BaseSlider.Track>;
export const SliderTrack = createComponentPart(BaseSlider.Track, 'tr-slider-track');
