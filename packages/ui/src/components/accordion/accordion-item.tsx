'use client';

import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AccordionItemProps = ComponentProps<typeof BaseAccordion.Item>;
export const AccordionItem = createComponentPart(
  BaseAccordion.Item,
  'tr-accordion-item',
);
