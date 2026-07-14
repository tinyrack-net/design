'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type FieldControlProps = ComponentProps<typeof BaseField.Control>;
export const FieldControl = createComponentPart(BaseField.Control, 'tr-input');
