'use client';

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRScrollAreaViewportProps = ComponentProps<typeof BaseScrollArea.Viewport>;
export const TRScrollAreaViewport = createComponentPart(
  BaseScrollArea.Viewport,
  'tr-scroll-area-viewport',
);
