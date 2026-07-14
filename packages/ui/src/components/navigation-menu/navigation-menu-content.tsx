'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type NavigationMenuContentProps = ComponentProps<
  typeof BaseNavigationMenu.Content
>;
export const NavigationMenuContent = createComponentPart(
  BaseNavigationMenu.Content,
  'tr-navigation-menu-content',
);
