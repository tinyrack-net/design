'use client';

import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AccordionHeaderProps = ComponentProps<typeof BaseAccordion.Header>;
export const AccordionHeader = createComponentPart(
  BaseAccordion.Header,
  'tr-accordion-header',
);
