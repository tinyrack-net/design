'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MenuBackdropProps = ComponentProps<typeof BaseMenu.Backdrop>;
export const MenuBackdrop = createComponentPart(BaseMenu.Backdrop, 'tr-menu-backdrop');
