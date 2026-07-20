'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAutocompleteRootProps = ComponentProps<typeof BaseAutocomplete.Root>;
export const TRAutocompleteRoot = createComponentPart(
  BaseAutocomplete.Root,
  'tr-autocomplete',
);
