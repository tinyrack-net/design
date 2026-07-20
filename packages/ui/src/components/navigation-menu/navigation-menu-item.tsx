'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRNavigationMenuItemProps = ComponentProps<typeof BaseNavigationMenu.Item>;
export const TRNavigationMenuItem = createComponentPart(
  BaseNavigationMenu.Item,
  'tr-navigation-menu-item',
);
