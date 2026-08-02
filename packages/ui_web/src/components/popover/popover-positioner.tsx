'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRPopoverPositionerProps = ComponentProps<typeof BasePopover.Positioner>;
export const TRPopoverPositioner = createComponentPart(
  BasePopover.Positioner,
  'tr-layer-positioner tr-popover-positioner',
);
