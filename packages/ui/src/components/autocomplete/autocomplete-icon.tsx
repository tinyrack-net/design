'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AutocompleteIconProps = ComponentProps<typeof BaseAutocomplete.Icon>;
export const AutocompleteIcon = createComponentPart(
  BaseAutocomplete.Icon,
  'tr-input-group-icon tr-autocomplete-icon',
);
