'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAutocompleteArrowProps = ComponentProps<typeof BaseAutocomplete.Arrow>;
export const TRAutocompleteArrow = createComponentPart(
  BaseAutocomplete.Arrow,
  'tr-layer-arrow tr-autocomplete-arrow',
);
