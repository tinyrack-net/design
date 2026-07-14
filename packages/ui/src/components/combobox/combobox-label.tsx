'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxLabelProps = ComponentProps<typeof BaseCombobox.Label>;
export const ComboboxLabel = createComponentPart(
  BaseCombobox.Label,
  'tr-combobox-label',
);
