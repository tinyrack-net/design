'use client';

import { Radio as BaseRadio } from '@base-ui/react/radio';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type RadioIndicatorProps = ComponentProps<typeof BaseRadio.Indicator>;
export const RadioIndicator = createComponentPart(
  BaseRadio.Indicator,
  'tr-radio-indicator',
);
