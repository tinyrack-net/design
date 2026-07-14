'use client';

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type NumberFieldDecrementProps = ComponentProps<
  typeof BaseNumberField.Decrement
>;
export const NumberFieldDecrement = createComponentPart(
  BaseNumberField.Decrement,
  'tr-number-field-decrement',
);
