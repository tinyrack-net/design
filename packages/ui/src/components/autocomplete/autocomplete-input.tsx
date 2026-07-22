'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import {
  type ComponentProps,
  type Ref,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { AutocompleteResetContext } from './autocomplete-form-context.js';

export type TRAutocompleteInputProps = ComponentProps<typeof BaseAutocomplete.Input>;

export function TRAutocompleteInput({
  className,
  ref,
  ...props
}: TRAutocompleteInputProps) {
  const handleReset = useContext(AutocompleteResetContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useCallback(
    (input: HTMLInputElement | null) => {
      inputRef.current = input;
      setRef(ref, input);
    },
    [ref],
  );

  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form || !handleReset) {
      return undefined;
    }
    form.addEventListener('reset', handleReset);
    return () => form.removeEventListener('reset', handleReset);
  }, [handleReset]);

  return (
    <BaseAutocomplete.Input
      {...props}
      className={mergeComponentClassName(
        'tr-input tr-input-group-input tr-autocomplete-input',
        className,
      )}
      ref={mergedRef}
    />
  );
}

function setRef<Value>(ref: Ref<Value> | undefined, value: Value | null) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}
