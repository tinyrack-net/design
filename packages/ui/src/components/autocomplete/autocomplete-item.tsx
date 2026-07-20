'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAutocompleteItemProps = ComponentProps<typeof BaseAutocomplete.Item>;
export const TRAutocompleteItem = createComponentPart(
  BaseAutocomplete.Item,
  'tr-autocomplete-item',
);
