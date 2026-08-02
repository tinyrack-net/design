'use client';

import { Radio as BaseRadio } from '@base-ui/react/radio';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRRadioIndicatorProps = ComponentProps<typeof BaseRadio.Indicator>;
export const TRRadioIndicator = createComponentPart(
  BaseRadio.Indicator,
  'tr-radio-indicator',
);
