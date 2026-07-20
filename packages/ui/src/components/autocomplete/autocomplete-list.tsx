'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAutocompleteListProps = ComponentProps<typeof BaseAutocomplete.List>;
export const TRAutocompleteList = createComponentPart(
  BaseAutocomplete.List,
  'tr-autocomplete-list',
);
