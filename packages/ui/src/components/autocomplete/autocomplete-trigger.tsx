'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAutocompleteTriggerProps = ComponentProps<
  typeof BaseAutocomplete.Trigger
>;
export const TRAutocompleteTrigger = createComponentPart(
  BaseAutocomplete.Trigger,
  'tr-input-group-action tr-autocomplete-trigger',
);
