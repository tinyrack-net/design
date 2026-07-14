'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxCollectionProps = ComponentProps<typeof BaseCombobox.Collection>;
export const ComboboxCollection = createComponentPart(
  BaseCombobox.Collection,
  'tr-combobox-collection',
);
