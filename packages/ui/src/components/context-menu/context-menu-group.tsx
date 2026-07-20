'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRContextMenuGroupProps = ComponentProps<typeof BaseContextMenu.Group>;
export const TRContextMenuGroup = createComponentPart(
  BaseContextMenu.Group,
  'tr-context-menu-group',
);
