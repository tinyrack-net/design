'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRPopoverRootProps = ComponentProps<typeof BasePopover.Root>;
export const TRPopoverRoot = createComponentPart(BasePopover.Root);
