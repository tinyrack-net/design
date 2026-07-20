'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRDrawerPortalProps = ComponentProps<typeof BaseDrawer.Portal>;
export const TRDrawerPortal = createComponentPart(
  BaseDrawer.Portal,
  'tr-drawer-portal',
);
