'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DrawerPortalProps = ComponentProps<typeof BaseDrawer.Portal>;
export const DrawerPortal = createComponentPart(BaseDrawer.Portal, 'tr-drawer-portal');
