'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type PopoverViewportProps = ComponentProps<typeof BasePopover.Viewport>;
export const PopoverViewport = createComponentPart(
  BasePopover.Viewport,
  'tr-popover-viewport',
);
