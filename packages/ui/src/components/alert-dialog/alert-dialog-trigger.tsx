'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AlertDialogTriggerProps = ComponentProps<typeof BaseAlertDialog.Trigger>;
export const AlertDialogTrigger = createComponentPart(
  BaseAlertDialog.Trigger,
  'tr-alert-dialog-trigger',
);
