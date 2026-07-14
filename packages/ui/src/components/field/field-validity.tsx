'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type FieldValidityProps = ComponentProps<typeof BaseField.Validity>;
export const FieldValidity = createComponentPart(
  BaseField.Validity,
  'tr-field-validity',
);
