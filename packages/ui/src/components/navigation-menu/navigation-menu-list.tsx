'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRNavigationMenuListProps = ComponentProps<typeof BaseNavigationMenu.List>;
export const TRNavigationMenuList = createComponentPart(
  BaseNavigationMenu.List,
  'tr-navigation-menu-list',
);
