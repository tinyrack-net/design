'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AutocompleteBackdropProps = ComponentProps<
  typeof BaseAutocomplete.Backdrop
>;
export const AutocompleteBackdrop = createComponentPart(
  BaseAutocomplete.Backdrop,
  'tr-autocomplete-backdrop',
);
