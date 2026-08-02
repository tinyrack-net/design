'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAutocompletePopupProps = ComponentProps<typeof BaseAutocomplete.Popup>;
export const TRAutocompletePopup = createComponentPart(
  BaseAutocomplete.Popup,
  'tr-layer tr-autocomplete-popup',
);
