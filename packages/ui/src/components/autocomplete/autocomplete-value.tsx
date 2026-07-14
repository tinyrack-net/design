'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AutocompleteValueProps = ComponentProps<typeof BaseAutocomplete.Value>;
export const AutocompleteValue = createComponentPart(
  BaseAutocomplete.Value,
  'tr-autocomplete-value',
);
