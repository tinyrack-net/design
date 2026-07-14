'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AutocompletePositionerProps = ComponentProps<
  typeof BaseAutocomplete.Positioner
>;
export const AutocompletePositioner = createComponentPart(
  BaseAutocomplete.Positioner,
  'tr-autocomplete-positioner',
);
