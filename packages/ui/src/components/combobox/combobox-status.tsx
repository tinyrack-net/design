'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxStatusProps = ComponentProps<typeof BaseCombobox.Status>;
export const ComboboxStatus = createComponentPart(
  BaseCombobox.Status,
  'tr-combobox-status',
);
