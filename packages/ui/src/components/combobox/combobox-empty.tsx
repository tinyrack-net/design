'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRComboboxEmptyProps = ComponentProps<typeof BaseCombobox.Empty>;
export const TRComboboxEmpty = createComponentPart(
  BaseCombobox.Empty,
  'tr-combobox-empty',
);
