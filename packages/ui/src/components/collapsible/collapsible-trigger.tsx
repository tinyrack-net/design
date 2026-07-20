'use client';

import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRCollapsibleTriggerProps = ComponentProps<typeof BaseCollapsible.Trigger>;
export const TRCollapsibleTrigger = createComponentPart(
  BaseCollapsible.Trigger,
  'tr-collapsible-summary',
);
