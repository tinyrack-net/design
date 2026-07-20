'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAutocompleteEmptyProps = ComponentProps<typeof BaseAutocomplete.Empty>;
export const TRAutocompleteEmpty = createComponentPart(
  BaseAutocomplete.Empty,
  'tr-autocomplete-empty',
);
