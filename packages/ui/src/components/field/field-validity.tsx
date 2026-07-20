'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRFieldValidityProps = ComponentProps<typeof BaseField.Validity>;
export const TRFieldValidity = createComponentPart(
  BaseField.Validity,
  'tr-field-validity',
);
