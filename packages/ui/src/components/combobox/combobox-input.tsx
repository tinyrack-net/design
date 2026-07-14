'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxInputProps = ComponentProps<typeof BaseCombobox.Input>;
export const ComboboxInput = createComponentPart(
  BaseCombobox.Input,
  'tr-combobox tr-input',
);
