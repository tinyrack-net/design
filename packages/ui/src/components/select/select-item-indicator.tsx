'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SelectItemIndicatorProps = ComponentProps<typeof BaseSelect.ItemIndicator>;
export const SelectItemIndicator = createComponentPart(
  BaseSelect.ItemIndicator,
  'tr-select-item-indicator',
);
