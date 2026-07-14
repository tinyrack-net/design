'use client';

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ScrollAreaScrollbarProps = ComponentProps<typeof BaseScrollArea.Scrollbar>;
export const ScrollAreaScrollbar = createComponentPart(
  BaseScrollArea.Scrollbar,
  'tr-scroll-area-scrollbar',
);
