'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMenuGroupProps = ComponentProps<typeof BaseMenu.Group>;
export const TRMenuGroup = createComponentPart(BaseMenu.Group, 'tr-menu-group');
