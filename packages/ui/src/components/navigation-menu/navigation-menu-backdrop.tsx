'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRNavigationMenuBackdropProps = ComponentProps<
  typeof BaseNavigationMenu.Backdrop
>;
export const TRNavigationMenuBackdrop = createComponentPart(
  BaseNavigationMenu.Backdrop,
  'tr-layer-backdrop tr-navigation-menu-backdrop',
);
