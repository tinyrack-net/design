'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DrawerCloseProps = ComponentProps<typeof BaseDrawer.Close>;
export const DrawerClose = createComponentPart(BaseDrawer.Close, 'tr-drawer-close');
