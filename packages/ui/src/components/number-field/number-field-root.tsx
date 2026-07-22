'use client';

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import {
  type ComponentProps,
  type Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRNumberFieldRootProps = ComponentProps<typeof BaseNumberField.Root>;

function setRef<Value>(ref: Ref<Value> | undefined, value: Value | null) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

export function TRNumberFieldRoot({
  className,
  defaultValue,
  inputRef,
  onValueChange,
  value,
  ...props
}: TRNumberFieldRootProps) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState<number | null>(
    defaultValue ?? null,
  );
  const [resetVersion, setResetVersion] = useState(0);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;
  const mergedInputRef = useCallback(
    (input: HTMLInputElement | null) => {
      hiddenInputRef.current = input;
      setRef(inputRef, input);
    },
    [inputRef],
  );

  useEffect(() => {
    const input = hiddenInputRef.current;
    const form = input?.form;
    if (!form || isControlled) {
      return undefined;
    }

    function handleReset(event: Event) {
      if (event.target !== form) {
        return;
      }
      queueMicrotask(() => {
        setUncontrolledValue(defaultValue ?? null);
        setResetVersion((version) => version + 1);
      });
    }

    form.ownerDocument.addEventListener('reset', handleReset, true);
    return () => form.ownerDocument.removeEventListener('reset', handleReset, true);
  }, [defaultValue, isControlled]);

  return (
    <BaseNumberField.Root
      {...props}
      className={mergeComponentClassName('tr-number-field', className)}
      inputRef={mergedInputRef}
      key={resetVersion}
      onValueChange={(nextValue, details) => {
        if (!isControlled) {
          setUncontrolledValue(nextValue);
        }
        onValueChange?.(nextValue, details);
      }}
      value={currentValue}
    />
  );
}
