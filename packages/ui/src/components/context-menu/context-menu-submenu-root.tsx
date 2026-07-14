'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ContextMenuSubmenuRootProps = ComponentProps<
  typeof BaseContextMenu.SubmenuRoot
>;
export const ContextMenuSubmenuRoot = createComponentPart(
  BaseContextMenu.SubmenuRoot,
  'tr-context-menu-submenu-root',
);
