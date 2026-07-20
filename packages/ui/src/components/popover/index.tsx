import { TRPopoverArrow } from './popover-arrow.js';
import { TRPopoverBackdrop } from './popover-backdrop.js';
import { TRPopoverClose } from './popover-close.js';
import { TRPopoverDescription } from './popover-description.js';
import { createPopoverHandle } from './popover-handle.js';
import { TRPopoverPopup } from './popover-popup.js';
import { TRPopoverPortal } from './popover-portal.js';
import { TRPopoverPositioner } from './popover-positioner.js';
import { TRPopoverRoot } from './popover-root.js';
import { TRPopoverTitle } from './popover-title.js';
import { TRPopoverTrigger } from './popover-trigger.js';
import { TRPopoverViewport } from './popover-viewport.js';

export const TRPopover: Readonly<{
  Root: typeof TRPopoverRoot;
  Trigger: typeof TRPopoverTrigger;
  Portal: typeof TRPopoverPortal;
  Positioner: typeof TRPopoverPositioner;
  Popup: typeof TRPopoverPopup;
  Arrow: typeof TRPopoverArrow;
  Backdrop: typeof TRPopoverBackdrop;
  Title: typeof TRPopoverTitle;
  Description: typeof TRPopoverDescription;
  Close: typeof TRPopoverClose;
  Viewport: typeof TRPopoverViewport;
  createHandle: typeof createPopoverHandle;
}> = {
  Root: TRPopoverRoot,
  Trigger: TRPopoverTrigger,
  Portal: TRPopoverPortal,
  Positioner: TRPopoverPositioner,
  Popup: TRPopoverPopup,
  Arrow: TRPopoverArrow,
  Backdrop: TRPopoverBackdrop,
  Title: TRPopoverTitle,
  Description: TRPopoverDescription,
  Close: TRPopoverClose,
  Viewport: TRPopoverViewport,
  createHandle: createPopoverHandle,
} as const;

export type {
  PopoverArrowState as TRPopoverArrowState,
  PopoverBackdropState as TRPopoverBackdropState,
  PopoverCloseState as TRPopoverCloseState,
  PopoverDescriptionState as TRPopoverDescriptionState,
  PopoverPopupState as TRPopoverPopupState,
  PopoverPortalState as TRPopoverPortalState,
  PopoverPositionerState as TRPopoverPositionerState,
  PopoverRootState as TRPopoverRootState,
  PopoverTitleState as TRPopoverTitleState,
  PopoverTriggerState as TRPopoverTriggerState,
  PopoverViewportState as TRPopoverViewportState,
} from '@base-ui/react/popover';
export type { TRPopoverArrowProps } from './popover-arrow.js';
export type { TRPopoverBackdropProps } from './popover-backdrop.js';
export type { TRPopoverCloseProps } from './popover-close.js';
export type { TRPopoverDescriptionProps } from './popover-description.js';
export type { TRPopoverHandle } from './popover-handle.js';
export type { TRPopoverPopupProps } from './popover-popup.js';
export type { TRPopoverPortalProps } from './popover-portal.js';
export type { TRPopoverPositionerProps } from './popover-positioner.js';
export type { TRPopoverRootProps } from './popover-root.js';
export type { TRPopoverTitleProps } from './popover-title.js';
export type { TRPopoverTriggerProps } from './popover-trigger.js';
export type { TRPopoverViewportProps } from './popover-viewport.js';
export {
  createPopoverHandle,
  TRPopoverArrow,
  TRPopoverBackdrop,
  TRPopoverClose,
  TRPopoverDescription,
  TRPopoverPopup,
  TRPopoverPortal,
  TRPopoverPositioner,
  TRPopoverRoot,
  TRPopoverTitle,
  TRPopoverTrigger,
  TRPopoverViewport,
};
