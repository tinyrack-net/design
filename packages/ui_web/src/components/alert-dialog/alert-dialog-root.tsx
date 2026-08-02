'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAlertDialogRootProps = ComponentProps<typeof BaseAlertDialog.Root>;
export const TRAlertDialogRoot = createComponentPart(
  BaseAlertDialog.Root,
  'tr-alert-dialog',
);
