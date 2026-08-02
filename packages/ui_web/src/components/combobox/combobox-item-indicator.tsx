'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRComboboxItemIndicatorProps = ComponentProps<
  typeof BaseCombobox.ItemIndicator
>;
export const TRComboboxItemIndicator = createComponentPart(
  BaseCombobox.ItemIndicator,
  'tr-combobox-item-indicator',
);
