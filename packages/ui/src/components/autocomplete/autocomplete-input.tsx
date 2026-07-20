'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAutocompleteInputProps = ComponentProps<typeof BaseAutocomplete.Input>;
export const TRAutocompleteInput = createComponentPart(
  BaseAutocomplete.Input,
  'tr-input tr-input-group-input tr-autocomplete-input',
);
