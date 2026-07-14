'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AutocompleteRowProps = ComponentProps<typeof BaseAutocomplete.Row>;
export const AutocompleteRow = createComponentPart(
  BaseAutocomplete.Row,
  'tr-autocomplete-row',
);
