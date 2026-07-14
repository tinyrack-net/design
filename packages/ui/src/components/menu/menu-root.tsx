'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MenuRootProps = ComponentProps<typeof BaseMenu.Root>;
export const MenuRoot = createComponentPart(BaseMenu.Root);
