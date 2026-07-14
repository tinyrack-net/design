'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type PopoverPositionerProps = ComponentProps<typeof BasePopover.Positioner>;
export const PopoverPositioner = createComponentPart(
  BasePopover.Positioner,
  'tr-popover-positioner',
);
