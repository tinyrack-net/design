'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRFieldErrorProps = ComponentProps<typeof BaseField.Error>;
export const TRFieldError = createComponentPart(BaseField.Error, 'tr-field-error');
