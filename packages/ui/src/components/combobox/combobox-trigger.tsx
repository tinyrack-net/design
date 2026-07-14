'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ComboboxTriggerProps = ComponentProps<typeof BaseCombobox.Trigger>;
export const ComboboxTrigger = createComponentPart(
  BaseCombobox.Trigger,
  'tr-combobox-trigger',
);
