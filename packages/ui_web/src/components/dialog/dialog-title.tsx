'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRDialogTitleProps = ComponentProps<typeof BaseDialog.Title>;
export const TRDialogTitle = createComponentPart(BaseDialog.Title, 'tr-dialog-title');
