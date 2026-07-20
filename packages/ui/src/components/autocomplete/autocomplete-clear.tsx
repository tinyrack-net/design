'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAutocompleteClearProps = ComponentProps<typeof BaseAutocomplete.Clear>;
export const TRAutocompleteClear = createComponentPart(
  BaseAutocomplete.Clear,
  'tr-input-group-action tr-autocomplete-clear',
);
