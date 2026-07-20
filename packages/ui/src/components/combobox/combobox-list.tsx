'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRComboboxListProps = ComponentProps<typeof BaseCombobox.List>;
export const TRComboboxList = createComponentPart(
  BaseCombobox.List,
  'tr-combobox-list',
);
