'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';

export function createAlertDialogHandle<Payload>() {
  return BaseAlertDialog.createHandle<Payload>();
}

export type TRAlertDialogHandle<Payload> = ReturnType<
  typeof createAlertDialogHandle<Payload>
>;
