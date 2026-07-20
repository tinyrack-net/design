'use client';

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRNumberFieldScrubAreaProps = ComponentProps<
  typeof BaseNumberField.ScrubArea
>;
export const TRNumberFieldScrubArea = createComponentPart(
  BaseNumberField.ScrubArea,
  'tr-number-field-scrub-area',
);
