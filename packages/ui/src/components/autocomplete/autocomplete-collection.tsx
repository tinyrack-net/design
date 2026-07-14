'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AutocompleteCollectionProps = ComponentProps<
  typeof BaseAutocomplete.Collection
>;
export const AutocompleteCollection = createComponentPart(
  BaseAutocomplete.Collection,
  'tr-autocomplete-collection',
);
