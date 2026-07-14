'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DrawerIndentBackgroundProps = ComponentProps<
  typeof BaseDrawer.IndentBackground
>;
export const DrawerIndentBackground = createComponentPart(
  BaseDrawer.IndentBackground,
  'tr-drawer-indent-background',
);
