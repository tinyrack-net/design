'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ContextMenuPopupProps = ComponentProps<typeof BaseContextMenu.Popup>;
export const ContextMenuPopup = createComponentPart(
  BaseContextMenu.Popup,
  'tr-context-menu-popup',
);
