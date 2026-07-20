'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRComboboxIconProps = ComponentProps<typeof BaseCombobox.Icon>;
export const TRComboboxIcon = createComponentPart(
  BaseCombobox.Icon,
  'tr-combobox-icon',
);
