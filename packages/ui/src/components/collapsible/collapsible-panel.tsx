'use client';

import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type CollapsiblePanelProps = ComponentProps<typeof BaseCollapsible.Panel>;
export const CollapsiblePanel = createComponentPart(
  BaseCollapsible.Panel,
  'tr-collapsible-content',
);
