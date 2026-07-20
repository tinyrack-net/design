'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAutocompleteGroupLabelProps = ComponentProps<
  typeof BaseAutocomplete.GroupLabel
>;
export const TRAutocompleteGroupLabel = createComponentPart(
  BaseAutocomplete.GroupLabel,
  'tr-autocomplete-group-label',
);
