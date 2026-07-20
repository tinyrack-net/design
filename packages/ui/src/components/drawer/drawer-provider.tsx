'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRDrawerProviderProps = ComponentProps<typeof BaseDrawer.Provider>;
export const TRDrawerProvider = createComponentPart(
  BaseDrawer.Provider,
  'tr-drawer-provider',
);
