'use client';

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRNumberFieldGroupProps = ComponentProps<typeof BaseNumberField.Group>;
export const TRNumberFieldGroup = createComponentPart(
  BaseNumberField.Group,
  'tr-number-field-group',
);
