'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ContextMenuBackdropProps = ComponentProps<typeof BaseContextMenu.Backdrop>;
export const ContextMenuBackdrop = createComponentPart(
  BaseContextMenu.Backdrop,
  'tr-context-menu-backdrop',
);
