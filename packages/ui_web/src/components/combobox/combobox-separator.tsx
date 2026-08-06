'use client';

import type { ComboboxSeparatorState } from '@base-ui/react/combobox';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRComboboxSeparatorProps = ComponentProps<typeof BaseCombobox.Separator>;
export type TRComboboxSeparatorState = ComboboxSeparatorState;

export const TRComboboxSeparator = createComponentPart(
  BaseCombobox.Separator,
  'tr-separator tr-combobox-separator',
);
