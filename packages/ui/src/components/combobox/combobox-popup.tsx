'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxPopupProps = ComponentProps<typeof BaseCombobox.Popup>;
export const ComboboxPopup = createComponentPart(
  BaseCombobox.Popup,
  'tr-layer tr-combobox-content',
);
