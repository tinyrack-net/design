'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxPositionerProps = ComponentProps<typeof BaseCombobox.Positioner>;
export const ComboboxPositioner = createComponentPart(
  BaseCombobox.Positioner,
  'tr-combobox-positioner',
);
