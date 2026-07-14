'use client';

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ScrollAreaRootProps = ComponentProps<typeof BaseScrollArea.Root>;
export const ScrollAreaRoot = createComponentPart(
  BaseScrollArea.Root,
  'tr-scroll-area',
);
