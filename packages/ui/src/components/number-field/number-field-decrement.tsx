'use client';

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRNumberFieldDecrementProps = ComponentProps<
  typeof BaseNumberField.Decrement
>;
export const TRNumberFieldDecrement = createComponentPart(
  BaseNumberField.Decrement,
  'tr-number-field-decrement',
);
