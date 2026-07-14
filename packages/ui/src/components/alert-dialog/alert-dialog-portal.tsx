'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AlertDialogPortalProps = ComponentProps<typeof BaseAlertDialog.Portal>;
export const AlertDialogPortal = createComponentPart(
  BaseAlertDialog.Portal,
  'tr-alert-dialog-portal',
);
