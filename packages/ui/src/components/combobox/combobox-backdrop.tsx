'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxBackdropProps = ComponentProps<typeof BaseCombobox.Backdrop>;
export const ComboboxBackdrop = createComponentPart(
  BaseCombobox.Backdrop,
  'tr-combobox-backdrop',
);
