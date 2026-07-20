'use client';

import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAccordionItemProps = ComponentProps<typeof BaseAccordion.Item>;
export const TRAccordionItem = createComponentPart(
  BaseAccordion.Item,
  'tr-accordion-item',
);
