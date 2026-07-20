'use client';

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRNumberFieldIncrementProps = ComponentProps<
  typeof BaseNumberField.Increment
>;
export const TRNumberFieldIncrement = createComponentPart(
  BaseNumberField.Increment,
  'tr-number-field-increment',
);
