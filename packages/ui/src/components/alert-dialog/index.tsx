import { AlertDialogBackdrop } from './alert-dialog-backdrop.js';
import { AlertDialogClose } from './alert-dialog-close.js';
import { AlertDialogDescription } from './alert-dialog-description.js';
import type { AlertDialogHandle as AlertDialogHandleType } from './alert-dialog-handle.js';
import { createAlertDialogHandle } from './alert-dialog-handle.js';
import { AlertDialogPopup } from './alert-dialog-popup.js';
import { AlertDialogPortal } from './alert-dialog-portal.js';
import { AlertDialogRoot } from './alert-dialog-root.js';
import { AlertDialogTitle } from './alert-dialog-title.js';
import { AlertDialogTrigger } from './alert-dialog-trigger.js';
import { AlertDialogViewport } from './alert-dialog-viewport.js';

export const AlertDialog = {
  Root: AlertDialogRoot,
  Backdrop: AlertDialogBackdrop,
  Close: AlertDialogClose,
  Description: AlertDialogDescription,
  Popup: AlertDialogPopup,
  Portal: AlertDialogPortal,
  Title: AlertDialogTitle,
  Trigger: AlertDialogTrigger,
  Viewport: AlertDialogViewport,
  createHandle: createAlertDialogHandle as <
    Payload,
  >() => AlertDialogHandleType<Payload>,
} as const;

export type {
  AlertDialogBackdropState,
  AlertDialogCloseState,
  AlertDialogDescriptionState,
  AlertDialogPopupState,
  AlertDialogPortalState,
  AlertDialogRootState,
  AlertDialogTitleState,
  AlertDialogTriggerState,
  AlertDialogViewportState,
} from '@base-ui/react/alert-dialog';
export type { AlertDialogBackdropProps } from './alert-dialog-backdrop.js';
export type { AlertDialogCloseProps } from './alert-dialog-close.js';
export type { AlertDialogDescriptionProps } from './alert-dialog-description.js';
export type { AlertDialogHandle } from './alert-dialog-handle.js';
export type { AlertDialogPopupProps } from './alert-dialog-popup.js';
export type { AlertDialogPortalProps } from './alert-dialog-portal.js';
export type { AlertDialogRootProps } from './alert-dialog-root.js';
export type { AlertDialogTitleProps } from './alert-dialog-title.js';
export type { AlertDialogTriggerProps } from './alert-dialog-trigger.js';
export type { AlertDialogViewportProps } from './alert-dialog-viewport.js';
export {
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogPopup,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogViewport,
  createAlertDialogHandle,
};
