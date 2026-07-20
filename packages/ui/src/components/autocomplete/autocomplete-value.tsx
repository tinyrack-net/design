'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAutocompleteValueProps = ComponentProps<typeof BaseAutocomplete.Value>;
export const TRAutocompleteValue = createComponentPart(
  BaseAutocomplete.Value,
  'tr-autocomplete-value',
);
