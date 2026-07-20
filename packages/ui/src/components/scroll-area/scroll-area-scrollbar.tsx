'use client';

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRScrollAreaScrollbarProps = ComponentProps<
  typeof BaseScrollArea.Scrollbar
>;
export const TRScrollAreaScrollbar = createComponentPart(
  BaseScrollArea.Scrollbar,
  'tr-scroll-area-scrollbar',
);
