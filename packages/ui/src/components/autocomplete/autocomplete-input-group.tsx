'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AutocompleteInputGroupProps = ComponentProps<
  typeof BaseAutocomplete.InputGroup
>;
export const AutocompleteInputGroup = createComponentPart(
  BaseAutocomplete.InputGroup,
  'tr-autocomplete-input-group',
);
