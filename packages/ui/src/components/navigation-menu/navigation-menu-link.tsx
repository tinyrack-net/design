'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type NavigationMenuLinkProps = ComponentProps<typeof BaseNavigationMenu.Link>;
export const NavigationMenuLink = createComponentPart(
  BaseNavigationMenu.Link,
  'tr-navigation-menu-link',
);
