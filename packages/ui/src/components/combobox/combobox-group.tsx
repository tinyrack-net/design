'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxGroupProps = ComponentProps<typeof BaseCombobox.Group>;
export const ComboboxGroup = createComponentPart(
  BaseCombobox.Group,
  'tr-combobox-group',
);
