'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRPopoverTitleProps = ComponentProps<typeof BasePopover.Title>;
export const TRPopoverTitle = createComponentPart(
  BasePopover.Title,
  'tr-popover-title',
);
