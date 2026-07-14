'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SelectItemTextProps = ComponentProps<typeof BaseSelect.ItemText>;
export const SelectItemText = createComponentPart(
  BaseSelect.ItemText,
  'tr-select-item-text',
);
