'use client';

import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAccordionHeaderProps = ComponentProps<typeof BaseAccordion.Header>;
export const TRAccordionHeader = createComponentPart(
  BaseAccordion.Header,
  'tr-accordion-header',
);
