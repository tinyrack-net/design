'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRComboboxCollectionProps = ComponentProps<typeof BaseCombobox.Collection>;
export const TRComboboxCollection = createComponentPart(
  BaseCombobox.Collection,
  'tr-combobox-collection',
);
