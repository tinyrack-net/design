'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRContextMenuBackdropProps = ComponentProps<
  typeof BaseContextMenu.Backdrop
>;
export const TRContextMenuBackdrop = createComponentPart(
  BaseContextMenu.Backdrop,
  'tr-layer-backdrop tr-context-menu-backdrop',
);
