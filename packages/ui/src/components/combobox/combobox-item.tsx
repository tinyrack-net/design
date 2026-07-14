'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxItemProps = ComponentProps<typeof BaseCombobox.Item>;
export const ComboboxItem = createComponentPart(
  BaseCombobox.Item,
  'tr-combobox-option',
);
