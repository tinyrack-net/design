'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';

export function useAutocompleteFilter(
  ...args: Parameters<typeof BaseAutocomplete.useFilter>
) {
  return BaseAutocomplete.useFilter(...args);
}

export function useAutocompleteFilteredItems<ItemValue>() {
  return BaseAutocomplete.useFilteredItems<ItemValue>();
}
