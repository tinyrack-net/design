'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRComboboxPopupProps = ComponentProps<typeof BaseCombobox.Popup>;
export const TRComboboxPopup = createComponentPart(
  BaseCombobox.Popup,
  'tr-layer tr-combobox-content',
);
