'use client';

import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type CollapsibleTriggerProps = ComponentProps<typeof BaseCollapsible.Trigger>;
export const CollapsibleTrigger = createComponentPart(
  BaseCollapsible.Trigger,
  'tr-collapsible-summary',
);
