'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ContextMenuGroupProps = ComponentProps<typeof BaseContextMenu.Group>;
export const ContextMenuGroup = createComponentPart(
  BaseContextMenu.Group,
  'tr-context-menu-group',
);
