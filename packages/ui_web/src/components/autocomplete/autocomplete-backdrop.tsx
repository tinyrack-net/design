'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAutocompleteBackdropProps = ComponentProps<
  typeof BaseAutocomplete.Backdrop
>;
export const TRAutocompleteBackdrop = createComponentPart(
  BaseAutocomplete.Backdrop,
  'tr-layer-backdrop tr-autocomplete-backdrop',
);
