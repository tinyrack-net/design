'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DrawerProviderProps = ComponentProps<typeof BaseDrawer.Provider>;
export const DrawerProvider = createComponentPart(
  BaseDrawer.Provider,
  'tr-drawer-provider',
);
