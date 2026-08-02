'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRContextMenuSubmenuTriggerProps = ComponentProps<
  typeof BaseContextMenu.SubmenuTrigger
>;
export const TRContextMenuSubmenuTrigger = createComponentPart(
  BaseContextMenu.SubmenuTrigger,
  'tr-context-menu-submenu-trigger',
);
