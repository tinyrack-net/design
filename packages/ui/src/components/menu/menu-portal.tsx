'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MenuPortalProps = ComponentProps<typeof BaseMenu.Portal>;
export const MenuPortal = createComponentPart(BaseMenu.Portal);
