'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ContextMenuRootProps = ComponentProps<typeof BaseContextMenu.Root>;
export const ContextMenuRoot = createComponentPart(
  BaseContextMenu.Root,
  'tr-context-menu',
);
