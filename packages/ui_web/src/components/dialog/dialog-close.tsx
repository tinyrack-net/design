'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRDialogCloseProps = ComponentProps<typeof BaseDialog.Close>;
export const TRDialogClose = createComponentPart(BaseDialog.Close, 'tr-dialog-close');
