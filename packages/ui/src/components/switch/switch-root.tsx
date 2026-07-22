'use client';

import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { type ComponentProps, useEffect, useRef, useState } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRSwitchRootProps = ComponentProps<typeof BaseSwitch.Root>;

export function TRSwitchRoot({
  checked,
  className,
  form,
  inputRef,
  ref,
  ...props
}: TRSwitchRootProps) {
  const internalInputRef = useRef<HTMLInputElement | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (checked !== undefined) return;
    const ownerForm = form
      ? document.getElementById(form)
      : internalInputRef.current?.form;
    if (!(ownerForm instanceof HTMLFormElement)) return;
    const reset = () => setResetKey((current) => current + 1);
    ownerForm.addEventListener('reset', reset);
    return () => ownerForm.removeEventListener('reset', reset);
  }, [checked, form]);

  return (
    <BaseSwitch.Root
      {...props}
      checked={checked}
      className={mergeComponentClassName('tr-switch', className)}
      form={form}
      inputRef={(node) => {
        internalInputRef.current = node;
        if (typeof inputRef === 'function') inputRef(node);
        else if (inputRef) inputRef.current = node;
      }}
      key={resetKey}
      ref={ref}
    />
  );
}
