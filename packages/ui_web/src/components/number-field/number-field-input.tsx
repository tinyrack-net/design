'use client';

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRNumberFieldInputProps = ComponentProps<typeof BaseNumberField.Input>;
export const TRNumberFieldInput = createComponentPart(
  BaseNumberField.Input,
  'tr-number-field-input',
);
