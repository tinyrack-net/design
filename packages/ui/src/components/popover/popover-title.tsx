'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type PopoverTitleProps = ComponentProps<typeof BasePopover.Title>;
export const PopoverTitle = createComponentPart(BasePopover.Title, 'tr-popover-title');
