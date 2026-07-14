'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DrawerRootProps = ComponentProps<typeof BaseDrawer.Root>;
export const DrawerRoot = createComponentPart(BaseDrawer.Root, 'tr-drawer');
