'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import { type ComponentProps, useEffect, useRef, useState } from 'react';

export type TRSelectRootProps = ComponentProps<typeof BaseSelect.Root>;

export function TRSelectRoot({ form, inputRef, value, ...props }: TRSelectRootProps) {
  const internalInputRef = useRef<HTMLInputElement | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (value !== undefined) return;
    const ownerForm = form
      ? document.getElementById(form)
      : internalInputRef.current?.form;
    if (!(ownerForm instanceof HTMLFormElement)) return;
    const reset = () => setResetKey((current) => current + 1);
    ownerForm.addEventListener('reset', reset);
    return () => ownerForm.removeEventListener('reset', reset);
  }, [form, value]);

  return (
    <BaseSelect.Root
      {...props}
      form={form}
      inputRef={(node) => {
        internalInputRef.current = node;
        if (typeof inputRef === 'function') inputRef(node);
        else if (inputRef) inputRef.current = node;
      }}
      key={resetKey}
      value={value}
    />
  );
}
