'use client';

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRNumberFieldRootProps = ComponentProps<typeof BaseNumberField.Root>;
export const TRNumberFieldRoot = createComponentPart(
  BaseNumberField.Root,
  'tr-number-field',
);
