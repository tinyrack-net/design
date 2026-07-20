'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ReactElement } from 'react';

export type TRComboboxRootProps<
  Value = unknown,
  Multiple extends boolean | undefined = false,
> = BaseCombobox.Root.Props<Value, Multiple>;

export function TRComboboxRoot<Value, Multiple extends boolean | undefined = false>(
  props: TRComboboxRootProps<Value, Multiple>,
): ReactElement {
  return <BaseCombobox.Root<Value, Multiple> {...props} />;
}
