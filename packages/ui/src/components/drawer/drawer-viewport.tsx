'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DrawerViewportProps = ComponentProps<typeof BaseDrawer.Viewport>;
export const DrawerViewport = createComponentPart(
  BaseDrawer.Viewport,
  'tr-drawer-viewport',
);
