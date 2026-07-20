'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRComboboxChipsProps = ComponentProps<typeof BaseCombobox.Chips>;
export const TRComboboxChips = createComponentPart(
  BaseCombobox.Chips,
  'tr-combobox-chips',
);
