'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MenuSubmenuRootProps = ComponentProps<typeof BaseMenu.SubmenuRoot>;
export const MenuSubmenuRoot = createComponentPart(
  BaseMenu.SubmenuRoot,
  'tr-menu-submenu-root',
);
