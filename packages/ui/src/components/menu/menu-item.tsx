'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MenuItemProps = ComponentProps<typeof BaseMenu.Item>;
export const MenuItem = createComponentPart(BaseMenu.Item, 'tr-menu-item');
