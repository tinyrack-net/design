'use client';

import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { type ComponentProps, useEffect, useRef, useState } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRCheckboxGroupProps = ComponentProps<typeof BaseCheckboxGroup>;

export function TRCheckboxGroup({
  className,
  ref,
  value,
  ...props
}: TRCheckboxGroupProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (value !== undefined) return;
    const reset = (event: Event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      const ownsForm = Array.from(
        rootRef.current?.querySelectorAll<HTMLInputElement>('input') ?? [],
      ).some((input) => input.form === form);
      if (rootRef.current?.closest('form') === form || ownsForm) {
        setResetKey((current) => current + 1);
      }
    };
    document.addEventListener('reset', reset, true);
    return () => document.removeEventListener('reset', reset, true);
  }, [value]);

  return (
    <BaseCheckboxGroup
      {...props}
      className={mergeComponentClassName('tr-checkbox-group', className)}
      key={resetKey}
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      value={value}
    />
  );
}
