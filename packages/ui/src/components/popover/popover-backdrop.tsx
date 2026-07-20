'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRPopoverBackdropProps = ComponentProps<typeof BasePopover.Backdrop>;
export const TRPopoverBackdrop = createComponentPart(
  BasePopover.Backdrop,
  'tr-layer-backdrop tr-popover-backdrop',
);
