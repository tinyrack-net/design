'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type NavigationMenuListProps = ComponentProps<typeof BaseNavigationMenu.List>;
export const NavigationMenuList = createComponentPart(
  BaseNavigationMenu.List,
  'tr-navigation-menu-list',
);
