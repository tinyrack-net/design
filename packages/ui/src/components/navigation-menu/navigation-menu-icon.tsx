'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type NavigationMenuIconProps = ComponentProps<typeof BaseNavigationMenu.Icon>;
export const NavigationMenuIcon = createComponentPart(
  BaseNavigationMenu.Icon,
  'tr-navigation-menu-icon',
);
