'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DialogTitleProps = ComponentProps<typeof BaseDialog.Title>;
export const DialogTitle = createComponentPart(BaseDialog.Title, 'tr-dialog-title');
