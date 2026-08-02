'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAutocompleteStatusProps = ComponentProps<typeof BaseAutocomplete.Status>;
export const TRAutocompleteStatus = createComponentPart(
  BaseAutocomplete.Status,
  'tr-autocomplete-status',
);
