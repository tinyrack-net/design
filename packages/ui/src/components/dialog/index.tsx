import { TRDialogBackdrop } from './dialog-backdrop.js';
import { TRDialogClose } from './dialog-close.js';
import { TRDialogDescription } from './dialog-description.js';
import type { TRDialogHandle as DialogHandleType } from './dialog-handle.js';
import { createDialogHandle } from './dialog-handle.js';
import { TRDialogPopup } from './dialog-popup.js';
import { TRDialogPortal } from './dialog-portal.js';
import { TRDialogRoot } from './dialog-root.js';
import { TRDialogTitle } from './dialog-title.js';
import { TRDialogTrigger } from './dialog-trigger.js';
import { TRDialogViewport } from './dialog-viewport.js';

export const TRDialog = {
  Backdrop: TRDialogBackdrop,
  Close: TRDialogClose,
  Description: TRDialogDescription,
  Popup: TRDialogPopup,
  Portal: TRDialogPortal,
  Root: TRDialogRoot,
  Viewport: TRDialogViewport,
  Title: TRDialogTitle,
  Trigger: TRDialogTrigger,
  createHandle: createDialogHandle as <Payload>() => DialogHandleType<Payload>,
} as const;

export type {
  DialogBackdropState as TRDialogBackdropState,
  DialogCloseState as TRDialogCloseState,
  DialogDescriptionState as TRDialogDescriptionState,
  DialogPopupState as TRDialogPopupState,
  DialogPortalState as TRDialogPortalState,
  DialogRootState as TRDialogRootState,
  DialogTitleState as TRDialogTitleState,
  DialogTriggerState as TRDialogTriggerState,
  DialogViewportState as TRDialogViewportState,
} from '@base-ui/react/dialog';
export type { TRDialogBackdropProps } from './dialog-backdrop.js';
export type { TRDialogCloseProps } from './dialog-close.js';
export type { TRDialogDescriptionProps } from './dialog-description.js';
export type { TRDialogHandle } from './dialog-handle.js';
export type {
  TRDialogPlacement,
  TRDialogPopupProps,
} from './dialog-popup.js';
export type { TRDialogPortalProps } from './dialog-portal.js';
export type { TRDialogRootProps } from './dialog-root.js';
export type { TRDialogTitleProps } from './dialog-title.js';
export type { TRDialogTriggerProps } from './dialog-trigger.js';
export type { TRDialogViewportProps } from './dialog-viewport.js';
export {
  createDialogHandle,
  TRDialogBackdrop,
  TRDialogClose,
  TRDialogDescription,
  TRDialogPopup,
  TRDialogPortal,
  TRDialogRoot,
  TRDialogTitle,
  TRDialogTrigger,
  TRDialogViewport,
};
