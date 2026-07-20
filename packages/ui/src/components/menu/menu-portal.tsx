'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMenuPortalProps = ComponentProps<typeof BaseMenu.Portal>;
export const TRMenuPortal = createComponentPart(BaseMenu.Portal);
