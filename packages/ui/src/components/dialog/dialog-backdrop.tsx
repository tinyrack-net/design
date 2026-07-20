'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRDialogBackdropProps = ComponentProps<typeof BaseDialog.Backdrop>;
export const TRDialogBackdrop = createComponentPart(
  BaseDialog.Backdrop,
  'tr-layer-backdrop tr-dialog-backdrop',
);
