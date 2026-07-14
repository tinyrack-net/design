'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ContextMenuLinkItemProps = ComponentProps<typeof BaseContextMenu.LinkItem>;
export const ContextMenuLinkItem = createComponentPart(
  BaseContextMenu.LinkItem,
  'tr-context-menu-link-item',
);
