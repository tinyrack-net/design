'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ContextMenuItemProps = ComponentProps<typeof BaseContextMenu.Item>;
export const ContextMenuItem = createComponentPart(
  BaseContextMenu.Item,
  'tr-context-menu-item',
);
