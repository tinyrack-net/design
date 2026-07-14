'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AlertDialogDescriptionProps = ComponentProps<
  typeof BaseAlertDialog.Description
>;
export const AlertDialogDescription = createComponentPart(
  BaseAlertDialog.Description,
  'tr-alert-dialog-description',
);
