'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type FieldLabelProps = ComponentProps<typeof BaseField.Label>;
export const FieldLabel = createComponentPart(BaseField.Label, 'tr-label');
