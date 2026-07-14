'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AutocompletePopupProps = ComponentProps<typeof BaseAutocomplete.Popup>;
export const AutocompletePopup = createComponentPart(
  BaseAutocomplete.Popup,
  'tr-autocomplete-popup',
);
