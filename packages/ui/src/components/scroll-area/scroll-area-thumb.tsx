'use client';

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ScrollAreaThumbProps = ComponentProps<typeof BaseScrollArea.Thumb>;
export const ScrollAreaThumb = createComponentPart(
  BaseScrollArea.Thumb,
  'tr-scroll-area-thumb',
);
