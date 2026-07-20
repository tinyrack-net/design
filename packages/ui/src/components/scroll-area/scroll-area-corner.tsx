'use client';

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRScrollAreaCornerProps = ComponentProps<typeof BaseScrollArea.Corner>;
export const TRScrollAreaCorner = createComponentPart(
  BaseScrollArea.Corner,
  'tr-scroll-area-corner',
);
