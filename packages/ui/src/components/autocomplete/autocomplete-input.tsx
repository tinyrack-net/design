'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AutocompleteInputProps = ComponentProps<typeof BaseAutocomplete.Input>;
export const AutocompleteInput = createComponentPart(
  BaseAutocomplete.Input,
  'tr-input tr-input-group-input tr-autocomplete-input',
);
