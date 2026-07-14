'use client';

import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type CollapsibleRootProps = ComponentProps<typeof BaseCollapsible.Root>;
export const CollapsibleRoot = createComponentPart(
  BaseCollapsible.Root,
  'tr-collapsible',
);
