'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAutocompleteInputGroupProps = ComponentProps<
  typeof BaseAutocomplete.InputGroup
>;
export const TRAutocompleteInputGroup = createComponentPart(
  BaseAutocomplete.InputGroup,
  'tr-input-group tr-autocomplete-input-group',
);
