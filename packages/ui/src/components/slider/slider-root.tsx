'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SliderRootProps = ComponentProps<typeof BaseSlider.Root>;
export const SliderRoot = createComponentPart(BaseSlider.Root, 'tr-slider');
