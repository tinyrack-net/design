'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRPopoverViewportProps = ComponentProps<typeof BasePopover.Viewport>;
export const TRPopoverViewport = createComponentPart(
  BasePopover.Viewport,
  'tr-layer-viewport tr-popover-viewport',
);
