'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAutocompleteSeparatorProps = ComponentProps<
  typeof BaseAutocomplete.Separator
>;

// The list styles this part through `.tr-separator`, so it carries no
// component-specific class of its own.
export const TRAutocompleteSeparator = createComponentPart(
  BaseAutocomplete.Separator,
  'tr-separator',
);
