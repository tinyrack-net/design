'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRComboboxTriggerProps = ComponentProps<typeof BaseCombobox.Trigger>;
export const TRComboboxTrigger = createComponentPart(
  BaseCombobox.Trigger,
  'tr-input-group-action tr-combobox-trigger',
);
