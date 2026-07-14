'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type FieldErrorProps = ComponentProps<typeof BaseField.Error>;
export const FieldError = createComponentPart(BaseField.Error, 'tr-field-error');
