'use client';

import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRToolbarRootProps = ComponentProps<typeof BaseToolbar.Root>;
export const TRToolbarRoot = createComponentPart(BaseToolbar.Root, 'tr-toolbar');
