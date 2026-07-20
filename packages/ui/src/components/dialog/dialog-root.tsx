'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRDialogRootProps = ComponentProps<typeof BaseDialog.Root>;
export const TRDialogRoot = createComponentPart(BaseDialog.Root);
