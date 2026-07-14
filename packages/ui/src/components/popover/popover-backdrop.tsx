'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type PopoverBackdropProps = ComponentProps<typeof BasePopover.Backdrop>;
export const PopoverBackdrop = createComponentPart(
  BasePopover.Backdrop,
  'tr-popover-backdrop',
);
