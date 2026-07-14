'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AutocompleteEmptyProps = ComponentProps<typeof BaseAutocomplete.Empty>;
export const AutocompleteEmpty = createComponentPart(
  BaseAutocomplete.Empty,
  'tr-autocomplete-empty',
);
