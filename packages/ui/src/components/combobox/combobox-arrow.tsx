'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxArrowProps = ComponentProps<typeof BaseCombobox.Arrow>;
export const ComboboxArrow = createComponentPart(
  BaseCombobox.Arrow,
  'tr-layer-arrow tr-combobox-arrow',
);
