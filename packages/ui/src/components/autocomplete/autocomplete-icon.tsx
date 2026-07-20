'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAutocompleteIconProps = ComponentProps<typeof BaseAutocomplete.Icon>;
export const TRAutocompleteIcon = createComponentPart(
  BaseAutocomplete.Icon,
  'tr-autocomplete-icon',
);
