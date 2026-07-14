'use client';

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type NumberFieldInputProps = ComponentProps<typeof BaseNumberField.Input>;
export const NumberFieldInput = createComponentPart(
  BaseNumberField.Input,
  'tr-number-field-input',
);
