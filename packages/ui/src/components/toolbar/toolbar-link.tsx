'use client';

import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRToolbarLinkProps = ComponentProps<typeof BaseToolbar.Link>;
export const TRToolbarLink = createComponentPart(BaseToolbar.Link, 'tr-toolbar-link');
