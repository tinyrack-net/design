'use client';

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ScrollAreaContentProps = ComponentProps<typeof BaseScrollArea.Content>;
export const ScrollAreaContent = createComponentPart(
  BaseScrollArea.Content,
  'tr-scroll-area-content',
);
