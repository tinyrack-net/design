'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DrawerVirtualKeyboardProviderProps = ComponentProps<
  typeof BaseDrawer.VirtualKeyboardProvider
>;
export const DrawerVirtualKeyboardProvider = createComponentPart(
  BaseDrawer.VirtualKeyboardProvider,
  'tr-drawer-virtual-keyboard-provider',
);
