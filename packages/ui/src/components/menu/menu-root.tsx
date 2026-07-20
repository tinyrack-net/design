'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMenuRootProps = ComponentProps<typeof BaseMenu.Root>;
export const TRMenuRoot = createComponentPart(BaseMenu.Root);
