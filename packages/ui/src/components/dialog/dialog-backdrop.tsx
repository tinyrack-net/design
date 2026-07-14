'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DialogBackdropProps = ComponentProps<typeof BaseDialog.Backdrop>;
export const DialogBackdrop = createComponentPart(
  BaseDialog.Backdrop,
  'tr-dialog-backdrop',
);
