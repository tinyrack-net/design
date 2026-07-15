import { DialogBackdrop } from './dialog-backdrop.js';
import { DialogClose } from './dialog-close.js';
import { DialogDescription } from './dialog-description.js';
import type { DialogHandle as DialogHandleType } from './dialog-handle.js';
import { createDialogHandle } from './dialog-handle.js';
import { DialogPopup } from './dialog-popup.js';
import { DialogPortal } from './dialog-portal.js';
import { DialogRoot } from './dialog-root.js';
import { DialogTitle } from './dialog-title.js';
import { DialogTrigger } from './dialog-trigger.js';
import { DialogViewport } from './dialog-viewport.js';

export const Dialog = {
  Backdrop: DialogBackdrop,
  Close: DialogClose,
  Description: DialogDescription,
  Popup: DialogPopup,
  Portal: DialogPortal,
  Root: DialogRoot,
  Viewport: DialogViewport,
  Title: DialogTitle,
  Trigger: DialogTrigger,
  createHandle: createDialogHandle as <Payload>() => DialogHandleType<Payload>,
} as const;

export type {
  DialogBackdropState,
  DialogCloseState,
  DialogDescriptionState,
  DialogPopupState,
  DialogPortalState,
  DialogRootState,
  DialogTitleState,
  DialogTriggerState,
  DialogViewportState,
} from '@base-ui/react/dialog';
export type { DialogBackdropProps } from './dialog-backdrop.js';
export type { DialogCloseProps } from './dialog-close.js';
export type { DialogDescriptionProps } from './dialog-description.js';
export type { DialogHandle } from './dialog-handle.js';
export type {
  DialogPlacement,
  DialogPopupProps,
} from './dialog-popup.js';
export type { DialogPortalProps } from './dialog-portal.js';
export type { DialogRootProps } from './dialog-root.js';
export type { DialogTitleProps } from './dialog-title.js';
export type { DialogTriggerProps } from './dialog-trigger.js';
export type { DialogViewportProps } from './dialog-viewport.js';
export {
  createDialogHandle,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DialogViewport,
};
