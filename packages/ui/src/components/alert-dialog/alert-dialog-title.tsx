'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AlertDialogTitleProps = ComponentProps<typeof BaseAlertDialog.Title>;
export const AlertDialogTitle = createComponentPart(
  BaseAlertDialog.Title,
  'tr-alert-dialog-title',
);
