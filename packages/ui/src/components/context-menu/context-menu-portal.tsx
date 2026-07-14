'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ContextMenuPortalProps = ComponentProps<typeof BaseContextMenu.Portal>;
export const ContextMenuPortal = createComponentPart(
  BaseContextMenu.Portal,
  'tr-context-menu-portal',
);
