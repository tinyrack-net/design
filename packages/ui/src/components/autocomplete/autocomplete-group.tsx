'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AutocompleteGroupProps = ComponentProps<typeof BaseAutocomplete.Group>;
export const AutocompleteGroup = createComponentPart(
  BaseAutocomplete.Group,
  'tr-autocomplete-group',
);
