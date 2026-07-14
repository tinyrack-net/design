'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';

export function useComboboxFilter(...args: Parameters<typeof BaseCombobox.useFilter>) {
  return BaseCombobox.useFilter(...args);
}

export function useComboboxFilteredItems(
  ...args: Parameters<typeof BaseCombobox.useFilteredItems>
) {
  return BaseCombobox.useFilteredItems(...args);
}
