import { PopoverArrow } from './popover-arrow.js';
import { PopoverBackdrop } from './popover-backdrop.js';
import { PopoverClose } from './popover-close.js';
import { PopoverDescription } from './popover-description.js';
import { createPopoverHandle } from './popover-handle.js';
import { PopoverPopup } from './popover-popup.js';
import { PopoverPortal } from './popover-portal.js';
import { PopoverPositioner } from './popover-positioner.js';
import { PopoverRoot } from './popover-root.js';
import { PopoverTitle } from './popover-title.js';
import { PopoverTrigger } from './popover-trigger.js';
import { PopoverViewport } from './popover-viewport.js';

export const Popover: Readonly<{
  Root: typeof PopoverRoot;
  Trigger: typeof PopoverTrigger;
  Portal: typeof PopoverPortal;
  Positioner: typeof PopoverPositioner;
  Popup: typeof PopoverPopup;
  Arrow: typeof PopoverArrow;
  Backdrop: typeof PopoverBackdrop;
  Title: typeof PopoverTitle;
  Description: typeof PopoverDescription;
  Close: typeof PopoverClose;
  Viewport: typeof PopoverViewport;
  createHandle: typeof createPopoverHandle;
}> = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Positioner: PopoverPositioner,
  Popup: PopoverPopup,
  Arrow: PopoverArrow,
  Backdrop: PopoverBackdrop,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
  Viewport: PopoverViewport,
  createHandle: createPopoverHandle,
} as const;

export type {
  PopoverArrowState,
  PopoverBackdropState,
  PopoverCloseState,
  PopoverDescriptionState,
  PopoverPopupState,
  PopoverPortalState,
  PopoverPositionerState,
  PopoverRootState,
  PopoverTitleState,
  PopoverTriggerState,
  PopoverViewportState,
} from '@base-ui/react/popover';
export type { PopoverArrowProps } from './popover-arrow.js';
export type { PopoverBackdropProps } from './popover-backdrop.js';
export type { PopoverCloseProps } from './popover-close.js';
export type { PopoverDescriptionProps } from './popover-description.js';
export type { PopoverHandle } from './popover-handle.js';
export type { PopoverPopupProps } from './popover-popup.js';
export type { PopoverPortalProps } from './popover-portal.js';
export type { PopoverPositionerProps } from './popover-positioner.js';
export type { PopoverRootProps } from './popover-root.js';
export type { PopoverTitleProps } from './popover-title.js';
export type { PopoverTriggerProps } from './popover-trigger.js';
export type { PopoverViewportProps } from './popover-viewport.js';
export {
  createPopoverHandle,
  PopoverArrow,
  PopoverBackdrop,
  PopoverClose,
  PopoverDescription,
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
  PopoverViewport,
};
