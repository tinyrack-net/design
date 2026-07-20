'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRContextMenuPopupProps = ComponentProps<typeof BaseContextMenu.Popup>;
export const TRContextMenuPopup = createComponentPart(
  BaseContextMenu.Popup,
  'tr-context-menu-popup',
);
