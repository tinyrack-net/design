'use client';

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRScrollAreaContentProps = ComponentProps<typeof BaseScrollArea.Content>;
export const TRScrollAreaContent = createComponentPart(
  BaseScrollArea.Content,
  'tr-scroll-area-content',
);
