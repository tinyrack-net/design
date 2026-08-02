'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSelectItemIndicatorProps = ComponentProps<
  typeof BaseSelect.ItemIndicator
>;
export const TRSelectItemIndicator = createComponentPart(
  BaseSelect.ItemIndicator,
  'tr-select-item-indicator',
);
