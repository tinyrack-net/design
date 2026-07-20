'use client';

import { Menubar as BaseMenubar } from '@base-ui/react/menubar';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMenubarProps = ComponentProps<typeof BaseMenubar>;
export const TRMenubar = createComponentPart(BaseMenubar, 'tr-menubar');
