'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRContextMenuPortalProps = ComponentProps<typeof BaseContextMenu.Portal>;
export const TRContextMenuPortal = createComponentPart(
  BaseContextMenu.Portal,
  'tr-context-menu-portal',
);
