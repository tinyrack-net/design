'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxChipsProps = ComponentProps<typeof BaseCombobox.Chips>;
export const ComboboxChips = createComponentPart(
  BaseCombobox.Chips,
  'tr-combobox-chips',
);
