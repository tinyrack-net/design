'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AutocompleteGroupLabelProps = ComponentProps<
  typeof BaseAutocomplete.GroupLabel
>;
export const AutocompleteGroupLabel = createComponentPart(
  BaseAutocomplete.GroupLabel,
  'tr-autocomplete-group-label',
);
