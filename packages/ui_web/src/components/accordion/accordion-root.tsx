'use client';

import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { TRAccordionItem } from './accordion-item.js';

export type TRAccordionRootProps<Value = unknown> = BaseAccordion.Root.Props<Value>;

function collectDisabledValues<Value>(children: ReactNode, values: Set<Value>) {
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const props = child.props as {
      children?: ReactNode;
      disabled?: boolean;
      value?: Value;
    };
    if (child.type === TRAccordionItem && props.disabled && props.value !== undefined) {
      values.add(props.value);
    }
    if (child.type === Fragment) {
      collectDisabledValues(props.children, values);
    }
  });
}

export function TRAccordionRoot<Value = unknown>({
  children,
  className,
  defaultValue,
  onValueChange,
  value,
  ...props
}: TRAccordionRootProps<Value>) {
  const disabledValues = new Set<Value>();
  collectDisabledValues(children, disabledValues);
  const normalize = (nextValue: Value[] | undefined) =>
    nextValue?.filter((itemValue) => !disabledValues.has(itemValue));

  return (
    <BaseAccordion.Root
      {...props}
      className={mergeComponentClassName('tr-accordion', className)}
      defaultValue={normalize(defaultValue)}
      onValueChange={(nextValue, eventDetails) =>
        onValueChange?.(normalize(nextValue) ?? [], eventDetails)
      }
      value={normalize(value)}
    >
      {children}
    </BaseAccordion.Root>
  );
}
