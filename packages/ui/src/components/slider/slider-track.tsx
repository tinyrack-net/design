'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSliderTrackProps = ComponentProps<typeof BaseSlider.Track>;
export const TRSliderTrack = createComponentPart(BaseSlider.Track, 'tr-slider-track');
