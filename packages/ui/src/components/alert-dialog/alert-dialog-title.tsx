'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAlertDialogTitleProps = ComponentProps<typeof BaseAlertDialog.Title>;
export const TRAlertDialogTitle = createComponentPart(
  BaseAlertDialog.Title,
  'tr-alert-dialog-title',
);
