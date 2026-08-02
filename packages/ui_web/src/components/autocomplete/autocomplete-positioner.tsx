'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAutocompletePositionerProps = ComponentProps<
  typeof BaseAutocomplete.Positioner
>;
export const TRAutocompletePositioner = createComponentPart(
  BaseAutocomplete.Positioner,
  'tr-layer-positioner tr-autocomplete-positioner',
);
