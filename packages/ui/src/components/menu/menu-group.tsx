'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MenuGroupProps = ComponentProps<typeof BaseMenu.Group>;
export const MenuGroup = createComponentPart(BaseMenu.Group, 'tr-menu-group');
