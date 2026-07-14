'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type FieldItemProps = ComponentProps<typeof BaseField.Item>;
export const FieldItem = createComponentPart(BaseField.Item, 'tr-field-item');
