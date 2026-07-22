'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ReactElement, Ref } from 'react';
import { useEffect, useRef, useState } from 'react';

export type TRComboboxRootProps<
  Value = unknown,
  Multiple extends boolean | undefined = false,
> = BaseCombobox.Root.Props<Value, Multiple>;

export function TRComboboxRoot<Value, Multiple extends boolean | undefined = false>({
  inputRef,
  ...props
}: TRComboboxRootProps<Value, Multiple>): ReactElement {
  const internalInputRef = useRef<HTMLInputElement>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const form = props.form
      ? document.getElementById(props.form)
      : internalInputRef.current?.form;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const handleReset = () => setResetKey((key) => key + 1);
    form.addEventListener('reset', handleReset);
    return () => form.removeEventListener('reset', handleReset);
  }, [props.form]);

  return (
    <BaseCombobox.Root<Value, Multiple>
      {...props}
      inputRef={(node) => {
        internalInputRef.current = node;
        setRef(inputRef, node);
      }}
      key={resetKey}
    />
  );
}

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}
