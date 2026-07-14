'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type FieldDescriptionProps = ComponentProps<typeof BaseField.Description>;
export const FieldDescription = createComponentPart(
  BaseField.Description,
  'tr-field-description',
);
