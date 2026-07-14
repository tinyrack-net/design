'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AutocompleteTriggerProps = ComponentProps<typeof BaseAutocomplete.Trigger>;
export const AutocompleteTrigger = createComponentPart(
  BaseAutocomplete.Trigger,
  'tr-autocomplete-trigger',
);
