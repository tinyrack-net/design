'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type PopoverDescriptionProps = ComponentProps<typeof BasePopover.Description>;
export const PopoverDescription = createComponentPart(
  BasePopover.Description,
  'tr-popover-description',
);
