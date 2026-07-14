'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AutocompletePortalProps = ComponentProps<typeof BaseAutocomplete.Portal>;
export const AutocompletePortal = createComponentPart(
  BaseAutocomplete.Portal,
  'tr-autocomplete-portal',
);
