'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRComboboxChipProps = ComponentProps<typeof BaseCombobox.Chip>;
export const TRComboboxChip = createComponentPart(
  BaseCombobox.Chip,
  'tr-combobox-chip',
);
