'use client';

import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAccordionTriggerProps = ComponentProps<typeof BaseAccordion.Trigger>;
export const TRAccordionTrigger = createComponentPart(
  BaseAccordion.Trigger,
  'tr-accordion-trigger tr-collapsible-summary',
);
