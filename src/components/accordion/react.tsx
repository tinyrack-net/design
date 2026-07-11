'use client';

import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Disclosure,
  DisclosureContent,
  type DisclosureContentProps,
  type DisclosureProps,
  DisclosureSummary,
  type DisclosureSummaryProps,
} from '../disclosure/react.js';
import {
  type AccordionChangeDetail,
  type AccordionType,
  type AccordionValue,
  accordionChangeEventName,
  accordionClassName,
  accordionContentClassName,
  accordionContract,
  accordionItemClassName,
  accordionSummaryClassName,
} from './contract.js';
import { createAccordionManager } from './dom.js';

export type { AccordionType, AccordionValue } from './contract.js';

function mergeClassNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ');
}

type ControlledValue<T> = { defaultValue?: never; value: T };
type UncontrolledValue<T> = { defaultValue?: T; value?: never };

type AccordionBaseProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> & {
  children?: ReactNode;
};

export type AccordionSingleProps = AccordionBaseProps &
  (ControlledValue<string | null> | UncontrolledValue<string | null>) & {
    collapsible?: boolean;
    onValueChange?: (value: string | null) => void;
    type?: 'single';
  };

export type AccordionMultipleProps = AccordionBaseProps &
  (ControlledValue<string[]> | UncontrolledValue<string[]>) & {
    collapsible?: never;
    onValueChange?: (value: string[]) => void;
    type: 'multiple';
  };

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

type AccordionContextValue = {
  groupName: string | undefined;
  type: AccordionType;
  value: AccordionValue;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext(name: string) {
  const context = useContext(AccordionContext);
  if (context === null) {
    throw new Error(`${name} must be used within Accordion.`);
  }
  return context;
}

function initialValue(type: AccordionType, value: AccordionValue | undefined) {
  if (type === 'multiple') {
    return Array.isArray(value) ? value : [];
  }
  return typeof value === 'string' ? value : null;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  {
    className,
    collapsible = accordionContract.defaultCollapsible,
    defaultValue,
    onValueChange,
    type = accordionContract.defaultType,
    value,
    ...props
  },
  forwardedRef,
) {
  const generatedId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const controlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<AccordionValue>(() =>
    initialValue(type, defaultValue),
  );
  const currentValue = controlled
    ? initialValue(type, value)
    : initialValue(type, uncontrolledValue);
  const groupName =
    type === 'single' ? `tr-accordion-${generatedId.replaceAll(':', '')}` : undefined;

  useEffect(() => {
    const root = rootRef.current as HTMLDivElement;
    const manager = createAccordionManager(root);
    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<AccordionChangeDetail>).detail;
      if (detail.root !== root || detail.type !== type) {
        return;
      }
      if (!controlled) {
        setUncontrolledValue(detail.value);
      }
      if (type === 'multiple') {
        (onValueChange as ((value: string[]) => void) | undefined)?.(
          Array.isArray(detail.value) ? detail.value : [],
        );
      } else {
        (onValueChange as ((value: string | null) => void) | undefined)?.(
          typeof detail.value === 'string' ? detail.value : null,
        );
      }
    };
    root.addEventListener(accordionChangeEventName, handleChange);
    return () => {
      root.removeEventListener(accordionChangeEventName, handleChange);
      manager.destroy();
    };
  }, [controlled, onValueChange, type]);

  const context = useMemo(
    () => ({ groupName, type, value: currentValue }),
    [currentValue, groupName, type],
  );
  const serializedValues =
    type === 'multiple' && Array.isArray(currentValue)
      ? JSON.stringify(currentValue)
      : undefined;
  const serializedValue =
    type === 'single' && typeof currentValue === 'string' ? currentValue : undefined;

  return (
    <AccordionContext.Provider value={context}>
      <div
        {...props}
        className={mergeClassNames(accordionClassName, className)}
        data-collapsible={type === 'single' ? String(collapsible) : undefined}
        data-controlled={String(controlled)}
        data-tr-accordion="true"
        data-type={type}
        data-value={serializedValue}
        data-values={serializedValues}
        ref={(element) => {
          rootRef.current = element;
          if (typeof forwardedRef === 'function') {
            forwardedRef(element);
          } else if (forwardedRef !== null) {
            forwardedRef.current = element;
          }
        }}
      />
    </AccordionContext.Provider>
  );
});

export type AccordionItemProps = Omit<DisclosureProps, 'name' | 'open'> & {
  value: string;
};

export const AccordionItem = forwardRef<HTMLDetailsElement, AccordionItemProps>(
  function AccordionItem({ className, value, ...props }, ref) {
    const context = useAccordionContext('AccordionItem');
    const open = Array.isArray(context.value)
      ? context.value.includes(value)
      : context.value === value;
    return (
      <Disclosure
        {...props}
        className={mergeClassNames(accordionItemClassName, className)}
        data-tr-accordion-item="true"
        data-value={value}
        name={context.groupName}
        open={open}
        ref={ref}
      />
    );
  },
);

export type AccordionSummaryProps = DisclosureSummaryProps;

export const AccordionSummary = forwardRef<HTMLElement, AccordionSummaryProps>(
  function AccordionSummary({ className, ...props }, ref) {
    useAccordionContext('AccordionSummary');
    return (
      <DisclosureSummary
        {...props}
        className={mergeClassNames(accordionSummaryClassName, className)}
        data-tr-accordion-summary="true"
        ref={ref}
      />
    );
  },
);

export type AccordionContentProps = DisclosureContentProps;

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ className, ...props }, ref) {
    useAccordionContext('AccordionContent');
    return (
      <DisclosureContent
        {...props}
        className={mergeClassNames(accordionContentClassName, className)}
        ref={ref}
      />
    );
  },
);
