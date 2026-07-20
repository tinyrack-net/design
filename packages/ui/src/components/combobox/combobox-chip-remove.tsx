'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRComboboxChipRemoveProps = ComponentProps<typeof BaseCombobox.ChipRemove>;
export const TRComboboxChipRemove = createComponentPart(
  BaseCombobox.ChipRemove,
  'tr-combobox-chip-remove',
);
