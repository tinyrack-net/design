'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AutocompleteRootProps = ComponentProps<typeof BaseAutocomplete.Root>;
export const AutocompleteRoot = createComponentPart(
  BaseAutocomplete.Root,
  'tr-autocomplete',
);
