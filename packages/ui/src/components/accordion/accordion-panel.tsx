'use client';

import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type AccordionPanelProps = ComponentProps<typeof BaseAccordion.Panel>;

export function AccordionPanel({ children, className, ...props }: AccordionPanelProps) {
  return (
    <BaseAccordion.Panel
      {...props}
      className={mergeComponentClassName(
        'tr-accordion-content tr-collapsible-content',
        className,
      )}
    >
      <div className="tr-accordion-content-inner">{children}</div>
    </BaseAccordion.Panel>
  );
}
