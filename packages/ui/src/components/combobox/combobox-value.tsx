'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxValueProps = ComponentProps<typeof BaseCombobox.Value>;
export const ComboboxValue = createComponentPart(
  BaseCombobox.Value,
  'tr-combobox-value',
);
