'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type NavigationMenuViewportProps = ComponentProps<
  typeof BaseNavigationMenu.Viewport
>;
export const NavigationMenuViewport = createComponentPart(
  BaseNavigationMenu.Viewport,
  'tr-navigation-menu-viewport',
);
