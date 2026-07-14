'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AutocompleteArrowProps = ComponentProps<typeof BaseAutocomplete.Arrow>;
export const AutocompleteArrow = createComponentPart(
  BaseAutocomplete.Arrow,
  'tr-autocomplete-arrow',
);
