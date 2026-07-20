'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRComboboxInputGroupProps = ComponentProps<typeof BaseCombobox.InputGroup>;
export const TRComboboxInputGroup = createComponentPart(
  BaseCombobox.InputGroup,
  'tr-input-group tr-combobox-input-group',
);
