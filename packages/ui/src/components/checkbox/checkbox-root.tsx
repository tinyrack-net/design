'use client';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { type ComponentPropsWithRef, useEffect, useRef, useState } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRCheckboxUiSize = 'sm' | 'md' | 'lg';
export type TRCheckboxRootProps = ComponentPropsWithRef<typeof BaseCheckbox.Root> & {
  uiSize?: TRCheckboxUiSize;
};

export function TRCheckboxRoot({
  checked,
  className,
  ref,
  uiSize = 'md',
  ...props
}: TRCheckboxRootProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (checked !== undefined) return;

    const reset = (event: Event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      let sibling = rootRef.current?.nextElementSibling ?? null;
      while (sibling instanceof HTMLInputElement) {
        if (sibling.type === 'checkbox' && sibling.form === form) {
          setResetKey((current) => current + 1);
          return;
        }
        sibling = sibling.nextElementSibling;
      }
    };

    document.addEventListener('reset', reset, true);
    return () => document.removeEventListener('reset', reset, true);
  }, [checked]);

  return (
    <BaseCheckbox.Root
      {...props}
      checked={checked}
      className={mergeComponentClassName('tr-checkbox', className)}
      data-ui-size={uiSize}
      key={resetKey}
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
    />
  );
}
