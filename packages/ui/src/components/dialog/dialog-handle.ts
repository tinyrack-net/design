'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';

export function createDialogHandle<Payload>() {
  return BaseDialog.createHandle<Payload>();
}

export type DialogHandle<Payload> = ReturnType<typeof createDialogHandle<Payload>>;
