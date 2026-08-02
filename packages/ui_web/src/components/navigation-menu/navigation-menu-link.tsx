'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRNavigationMenuLinkProps = ComponentProps<typeof BaseNavigationMenu.Link>;
export const TRNavigationMenuLink = createComponentPart(
  BaseNavigationMenu.Link,
  'tr-navigation-menu-link',
);
