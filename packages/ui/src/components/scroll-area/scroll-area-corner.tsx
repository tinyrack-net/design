'use client';

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ScrollAreaCornerProps = ComponentProps<typeof BaseScrollArea.Corner>;
export const ScrollAreaCorner = createComponentPart(
  BaseScrollArea.Corner,
  'tr-scroll-area-corner',
);
