'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type PopoverRootProps = ComponentProps<typeof BasePopover.Root>;
export const PopoverRoot = createComponentPart(BasePopover.Root);
