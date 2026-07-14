'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MenuViewportProps = ComponentProps<typeof BaseMenu.Viewport>;
export const MenuViewport = createComponentPart(BaseMenu.Viewport, 'tr-menu-viewport');
