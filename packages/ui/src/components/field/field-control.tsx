'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRFieldControlProps = ComponentProps<typeof BaseField.Control>;
export const TRFieldControl = createComponentPart(
  BaseField.Control,
  'tr-field-control',
);
