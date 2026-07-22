'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { type ReactElement, useCallback, useState } from 'react';
import { AutocompleteResetContext } from './autocomplete-form-context.js';

export type TRAutocompleteRootProps<ItemValue = unknown> =
  BaseAutocomplete.Root.Props<ItemValue>;

export function TRAutocompleteRoot<
  Items extends readonly { items: readonly unknown[] }[],
>(
  props: Omit<TRAutocompleteRootProps<Items[number]['items'][number]>, 'items'> & {
    items: Items;
  },
): ReactElement;
export function TRAutocompleteRoot<ItemValue>(
  props: Omit<TRAutocompleteRootProps<ItemValue>, 'items'> & {
    items?: readonly ItemValue[] | undefined;
  },
): ReactElement;
export function TRAutocompleteRoot(
  props: TRAutocompleteRootProps<unknown>,
): ReactElement {
  const { defaultValue, onValueChange, value, ...rootProps } = props;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
  const [resetVersion, setResetVersion] = useState(0);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;
  const handleReset = useCallback(() => {
    if (isControlled) {
      return;
    }
    setTimeout(() => {
      setUncontrolledValue(defaultValue ?? '');
      setResetVersion((version) => version + 1);
    });
  }, [defaultValue, isControlled]);

  return (
    <AutocompleteResetContext value={handleReset}>
      <BaseAutocomplete.Root
        {...rootProps}
        key={resetVersion}
        onValueChange={(nextValue, details) => {
          if (!isControlled) {
            setUncontrolledValue(nextValue);
          }
          onValueChange?.(nextValue, details);
        }}
        value={currentValue}
      />
    </AutocompleteResetContext>
  );
}
