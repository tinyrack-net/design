'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRComboboxInputProps = ComponentProps<typeof BaseCombobox.Input>;
export const TRComboboxInput = createComponentPart(
  BaseCombobox.Input,
  'tr-input tr-input-group-input tr-combobox',
);
