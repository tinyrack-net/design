'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxChipProps = ComponentProps<typeof BaseCombobox.Chip>;
export const ComboboxChip = createComponentPart(BaseCombobox.Chip, 'tr-combobox-chip');
