'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type NavigationMenuPositionerProps = ComponentProps<
  typeof BaseNavigationMenu.Positioner
>;
export const NavigationMenuPositioner = createComponentPart(
  BaseNavigationMenu.Positioner,
  'tr-navigation-menu-positioner',
);
