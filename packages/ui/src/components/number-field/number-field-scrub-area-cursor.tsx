'use client';

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type NumberFieldScrubAreaCursorProps = ComponentProps<
  typeof BaseNumberField.ScrubAreaCursor
>;
export const NumberFieldScrubAreaCursor = createComponentPart(
  BaseNumberField.ScrubAreaCursor,
  'tr-number-field-scrub-area-cursor',
);
