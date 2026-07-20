'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRComboboxBackdropProps = ComponentProps<typeof BaseCombobox.Backdrop>;
export const TRComboboxBackdrop = createComponentPart(
  BaseCombobox.Backdrop,
  'tr-layer-backdrop tr-combobox-backdrop',
);
