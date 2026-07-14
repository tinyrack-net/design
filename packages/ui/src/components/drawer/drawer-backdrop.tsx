'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DrawerBackdropProps = ComponentProps<typeof BaseDrawer.Backdrop>;
export const DrawerBackdrop = createComponentPart(
  BaseDrawer.Backdrop,
  'tr-drawer-backdrop',
);
