'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxInputGroupProps = ComponentProps<typeof BaseCombobox.InputGroup>;
export const ComboboxInputGroup = createComponentPart(
  BaseCombobox.InputGroup,
  'tr-combobox-input-group',
);
