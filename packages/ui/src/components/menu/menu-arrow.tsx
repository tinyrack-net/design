'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MenuArrowProps = ComponentProps<typeof BaseMenu.Arrow>;
export const MenuArrow = createComponentPart(BaseMenu.Arrow, 'tr-menu-arrow');
