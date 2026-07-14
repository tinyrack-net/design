'use client';

import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { type ComponentProps, useEffect, useRef, useState } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type CheckboxGroupProps = ComponentProps<typeof BaseCheckboxGroup>;

export function CheckboxGroup({ className, ref, value, ...props }: CheckboxGroupProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (value !== undefined) return;
    const form = rootRef.current?.closest('form');
    if (!form) return;

    const reset = () => setResetKey((current) => current + 1);
    form.addEventListener('reset', reset);
    return () => form.removeEventListener('reset', reset);
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
