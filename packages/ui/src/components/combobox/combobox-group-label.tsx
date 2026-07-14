'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxGroupLabelProps = ComponentProps<typeof BaseCombobox.GroupLabel>;
export const ComboboxGroupLabel = createComponentPart(
  BaseCombobox.GroupLabel,
  'tr-combobox-group-label',
);
