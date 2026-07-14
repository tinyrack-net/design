'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type NavigationMenuBackdropProps = ComponentProps<
  typeof BaseNavigationMenu.Backdrop
>;
export const NavigationMenuBackdrop = createComponentPart(
  BaseNavigationMenu.Backdrop,
  'tr-navigation-menu-backdrop',
);
