'use client';

import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ToolbarInputProps = ComponentProps<typeof BaseToolbar.Input>;
export const ToolbarInput = createComponentPart(BaseToolbar.Input, 'tr-toolbar-input');
