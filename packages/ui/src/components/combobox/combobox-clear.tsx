'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRComboboxClearProps = ComponentProps<typeof BaseCombobox.Clear>;
export const TRComboboxClear = createComponentPart(
  BaseCombobox.Clear,
  'tr-input-group-action tr-combobox-clear',
);
