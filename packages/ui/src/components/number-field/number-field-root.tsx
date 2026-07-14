'use client';

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type NumberFieldRootProps = ComponentProps<typeof BaseNumberField.Root>;
export const NumberFieldRoot = createComponentPart(
  BaseNumberField.Root,
  'tr-number-field',
);
