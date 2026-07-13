'use client';

import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { composeRefs } from '../../internal/react/slot.js';
import { usePopoverContext } from '../popover/context.js';
import type { PopoverPlacement } from '../popover/contract.js';
import {
  Popover,
  PopoverContent,
  type PopoverContentProps,
  type PopoverOpenProps,
} from '../popover/react.js';
import {
  type ComboboxInputChangeDetail,
  type ComboboxMode,
  type ComboboxValueChangeDetail,
  comboboxClassName,
  comboboxContentClassName,
  comboboxContract,
  comboboxEmptyClassName,
  comboboxInputChangeEventName,
  comboboxInputClassName,
  comboboxListClassName,
  comboboxOptionClassName,
  comboboxValueChangeEventName,
} from './contract.js';
import { createComboboxManager } from './dom.js';

type ComboboxContextValue = {
  contentId: string;
  disabled: boolean;
  inputValue: string;
  invalid: boolean;
  listId: string;
  mode: ComboboxMode;
  value: string;
};

const ComboboxContext = createContext<ComboboxContextValue | null>(null);

function useComboboxContext(name: string) {
  const context = useContext(ComboboxContext);
  if (context === null) {
    throw new Error(`${name} must be used within Combobox.`);
  }
  return context;
}

function mergeClassNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ');
}

type ControllableValueProps = {
  defaultInputValue?: string;
  defaultValue?: string;
  inputValue?: string;
  onInputValueChange?: (value: string) => void;
  onValueChange?: (value: string, detail: ComboboxValueChangeDetail) => void;
  value?: string;
};

export type ComboboxProps = Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> &
  PopoverOpenProps &
  ControllableValueProps & {
    autoSelectOnBlur?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    mode?: ComboboxMode;
    name?: string;
    placement?: PopoverPlacement;
  };

export function Combobox({
  autoSelectOnBlur = comboboxContract.defaultAutoSelectOnBlur,
  children,
  className,
  defaultInputValue = '',
  defaultOpen,
  defaultValue = '',
  disabled = false,
  inputValue: controlledInputValue,
  invalid = false,
  mode = comboboxContract.defaultMode,
  name,
  onInputValueChange,
  onOpenChange,
  onValueChange,
  open,
  placement = comboboxContract.defaultPlacement,
  value: controlledValue,
  ...rootProps
}: ComboboxProps) {
  const generatedId = useId().replace(/:/g, '');
  const contentId = `tr-combobox-${generatedId}`;
  const listId = `${contentId}-list`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [uncontrolledInputValue, setUncontrolledInputValue] =
    useState(defaultInputValue);
  const value = controlledValue ?? uncontrolledValue;
  const inputValue = controlledInputValue ?? uncontrolledInputValue;

  const handleInputChange = useCallback(
    (event: Event) => {
      const detail = (event as CustomEvent<ComboboxInputChangeDetail>).detail;
      if (controlledInputValue === undefined) {
        setUncontrolledInputValue(detail.inputValue);
      }
      onInputValueChange?.(detail.inputValue);
    },
    [controlledInputValue, onInputValueChange],
  );

  const handleValueChange = useCallback(
    (event: Event) => {
      const detail = (event as CustomEvent<ComboboxValueChangeDetail>).detail;
      if (controlledValue === undefined) {
        setUncontrolledValue(detail.value);
      }
      if (controlledInputValue === undefined) {
        setUncontrolledInputValue(detail.inputValue);
      }
      onValueChange?.(detail.value, detail);
    },
    [controlledInputValue, controlledValue, onValueChange],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (root === null) {
      return;
    }
    const manager = createComboboxManager(root);
    root.addEventListener(comboboxInputChangeEventName, handleInputChange);
    root.addEventListener(comboboxValueChangeEventName, handleValueChange);
    return () => {
      root.removeEventListener(comboboxInputChangeEventName, handleInputChange);
      root.removeEventListener(comboboxValueChangeEventName, handleValueChange);
      manager.destroy();
    };
  }, [handleInputChange, handleValueChange]);

  const context = useMemo(
    () => ({ contentId, disabled, inputValue, invalid, listId, mode, value }),
    [contentId, disabled, inputValue, invalid, listId, mode, value],
  );
  const popoverOpenProps: PopoverOpenProps =
    open === undefined
      ? ({
          ...(defaultOpen === undefined ? {} : { defaultOpen }),
          ...(onOpenChange === undefined ? {} : { onOpenChange }),
        } as PopoverOpenProps)
      : { onOpenChange: onOpenChange ?? (() => undefined), open };

  return (
    <ComboboxContext.Provider value={context}>
      <Popover
        {...popoverOpenProps}
        id={contentId}
        matchAnchorWidth
        mode="auto"
        placement={placement}
      >
        <div
          {...rootProps}
          aria-disabled={disabled || undefined}
          className={mergeClassNames(comboboxClassName, className)}
          data-auto-select-on-blur={String(autoSelectOnBlur)}
          data-invalid={invalid ? 'true' : undefined}
          data-mode={mode}
          data-tr-combobox="true"
          ref={rootRef}
        >
          {children}
          {name === undefined ? null : (
            <input
              data-tr-combobox-hidden="true"
              name={name}
              readOnly
              type="hidden"
              value={value}
            />
          )}
        </div>
      </Popover>
    </ComboboxContext.Provider>
  );
}

export type ComboboxInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'defaultValue' | 'value'
>;

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  function ComboboxInput({ className, disabled, ...props }, ref) {
    const context = useComboboxContext('ComboboxInput');
    const popover = usePopoverContext('ComboboxInput');
    const composedRef = composeRefs(
      popover.anchorRef as MutableRefObject<HTMLInputElement | null>,
      ref,
    );
    return (
      <input
        {...props}
        aria-autocomplete={context.mode === 'freeform' ? 'both' : 'list'}
        aria-controls={context.listId}
        aria-expanded={popover.open}
        aria-haspopup="listbox"
        aria-invalid={context.invalid || props['aria-invalid'] || undefined}
        autoComplete="off"
        className={mergeClassNames('tr-input', comboboxInputClassName, className)}
        data-tr-combobox-input="true"
        disabled={context.disabled || disabled}
        onChange={props.onChange ?? (() => undefined)}
        ref={composedRef}
        role="combobox"
        value={context.inputValue}
      />
    );
  },
);

export type ComboboxContentProps = PopoverContentProps;

export const ComboboxContent = forwardRef<HTMLDivElement, ComboboxContentProps>(
  function ComboboxContent({ className, ...props }, ref) {
    return (
      <PopoverContent
        {...props}
        className={mergeClassNames(comboboxContentClassName, className)}
        data-tr-combobox-content="true"
        ref={ref}
      />
    );
  },
);

export type ComboboxListProps = HTMLAttributes<HTMLDivElement>;

export const ComboboxList = forwardRef<HTMLDivElement, ComboboxListProps>(
  function ComboboxList({ className, ...props }, ref) {
    const context = useComboboxContext('ComboboxList');
    return (
      <div
        {...props}
        className={mergeClassNames(comboboxListClassName, className)}
        id={context.listId}
        ref={ref}
        role="listbox"
      />
    );
  },
);

export type ComboboxOptionProps = HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean;
  textValue?: string;
  value: string;
};

export const ComboboxOption = forwardRef<HTMLDivElement, ComboboxOptionProps>(
  function ComboboxOption(
    { className, disabled = false, id, textValue, value, ...props },
    ref,
  ) {
    const context = useComboboxContext('ComboboxOption');
    const generatedId = useId().replace(/:/g, '');
    return (
      <div
        {...props}
        aria-disabled={disabled || undefined}
        aria-selected={context.value === value}
        className={mergeClassNames(comboboxOptionClassName, className)}
        data-text-value={textValue}
        data-value={value}
        id={id ?? `${context.listId}-option-${generatedId}`}
        ref={ref}
        role="option"
        tabIndex={-1}
      />
    );
  },
);

export type ComboboxEmptyProps = HTMLAttributes<HTMLDivElement>;

export const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyProps>(
  function ComboboxEmpty({ className, hidden = true, ...props }, ref) {
    return (
      <div
        {...props}
        className={mergeClassNames(comboboxEmptyClassName, className)}
        data-tr-combobox-empty="true"
        hidden={hidden}
        ref={ref}
        role="status"
      />
    );
  },
);

export type { ComboboxMode } from './contract.js';
