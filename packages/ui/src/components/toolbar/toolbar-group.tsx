'use client';

import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ToolbarGroupProps = ComponentProps<typeof BaseToolbar.Group>;
export const ToolbarGroup = createComponentPart(BaseToolbar.Group, 'tr-toolbar-group');
