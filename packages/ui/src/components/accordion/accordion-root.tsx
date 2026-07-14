'use client';

import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AccordionRootProps = ComponentProps<typeof BaseAccordion.Root>;
export const AccordionRoot = createComponentPart(BaseAccordion.Root, 'tr-accordion');
