import { TRAlertDialogBackdrop } from './alert-dialog-backdrop.js';
import { TRAlertDialogClose } from './alert-dialog-close.js';
import { TRAlertDialogDescription } from './alert-dialog-description.js';
import type { TRAlertDialogHandle as AlertDialogHandleType } from './alert-dialog-handle.js';
import { createAlertDialogHandle } from './alert-dialog-handle.js';
import { TRAlertDialogPopup } from './alert-dialog-popup.js';
import { TRAlertDialogPortal } from './alert-dialog-portal.js';
import { TRAlertDialogRoot } from './alert-dialog-root.js';
import { TRAlertDialogTitle } from './alert-dialog-title.js';
import { TRAlertDialogTrigger } from './alert-dialog-trigger.js';
import { TRAlertDialogViewport } from './alert-dialog-viewport.js';

export const TRAlertDialog = {
  Root: TRAlertDialogRoot,
  Backdrop: TRAlertDialogBackdrop,
  Close: TRAlertDialogClose,
  Description: TRAlertDialogDescription,
  Popup: TRAlertDialogPopup,
  Portal: TRAlertDialogPortal,
  Title: TRAlertDialogTitle,
  Trigger: TRAlertDialogTrigger,
  Viewport: TRAlertDialogViewport,
  createHandle: createAlertDialogHandle as <
    Payload,
  >() => AlertDialogHandleType<Payload>,
} as const;

export type {
  AlertDialogBackdropState as TRAlertDialogBackdropState,
  AlertDialogCloseState as TRAlertDialogCloseState,
  AlertDialogDescriptionState as TRAlertDialogDescriptionState,
  AlertDialogPopupState as TRAlertDialogPopupState,
  AlertDialogPortalState as TRAlertDialogPortalState,
  AlertDialogRootState as TRAlertDialogRootState,
  AlertDialogTitleState as TRAlertDialogTitleState,
  AlertDialogTriggerState as TRAlertDialogTriggerState,
  AlertDialogViewportState as TRAlertDialogViewportState,
} from '@base-ui/react/alert-dialog';
export type { TRAlertDialogBackdropProps } from './alert-dialog-backdrop.js';
export type { TRAlertDialogCloseProps } from './alert-dialog-close.js';
export type { TRAlertDialogDescriptionProps } from './alert-dialog-description.js';
export type { TRAlertDialogHandle } from './alert-dialog-handle.js';
export type { TRAlertDialogPopupProps } from './alert-dialog-popup.js';
export type { TRAlertDialogPortalProps } from './alert-dialog-portal.js';
export type { TRAlertDialogRootProps } from './alert-dialog-root.js';
export type { TRAlertDialogTitleProps } from './alert-dialog-title.js';
export type { TRAlertDialogTriggerProps } from './alert-dialog-trigger.js';
export type { TRAlertDialogViewportProps } from './alert-dialog-viewport.js';
export {
  createAlertDialogHandle,
  TRAlertDialogBackdrop,
  TRAlertDialogClose,
  TRAlertDialogDescription,
  TRAlertDialogPopup,
  TRAlertDialogPortal,
  TRAlertDialogRoot,
  TRAlertDialogTitle,
  TRAlertDialogTrigger,
  TRAlertDialogViewport,
};
