import { PreviewCardArrow } from './preview-card-arrow.js';
import { PreviewCardBackdrop } from './preview-card-backdrop.js';
import type { PreviewCardHandle as PreviewCardHandleType } from './preview-card-handle.js';
import { createPreviewCardHandle } from './preview-card-handle.js';
import { PreviewCardPopup } from './preview-card-popup.js';
import { PreviewCardPortal } from './preview-card-portal.js';
import { PreviewCardPositioner } from './preview-card-positioner.js';
import { PreviewCardRoot } from './preview-card-root.js';
import { PreviewCardTrigger } from './preview-card-trigger.js';
import { PreviewCardViewport } from './preview-card-viewport.js';

export const PreviewCard = {
  Root: PreviewCardRoot,
  Portal: PreviewCardPortal,
  Trigger: PreviewCardTrigger,
  Positioner: PreviewCardPositioner,
  Popup: PreviewCardPopup,
  Arrow: PreviewCardArrow,
  Backdrop: PreviewCardBackdrop,
  Viewport: PreviewCardViewport,
  createHandle: createPreviewCardHandle as <
    Payload,
  >() => PreviewCardHandleType<Payload>,
} as const;

export type {
  PreviewCardArrowState,
  PreviewCardBackdropState,
  PreviewCardPopupState,
  PreviewCardPortalState,
  PreviewCardPositionerState,
  PreviewCardRootState,
  PreviewCardTriggerState,
  PreviewCardViewportState,
} from '@base-ui/react/preview-card';
export type { PreviewCardArrowProps } from './preview-card-arrow.js';
export type { PreviewCardBackdropProps } from './preview-card-backdrop.js';
export type { PreviewCardHandle } from './preview-card-handle.js';
export type { PreviewCardPopupProps } from './preview-card-popup.js';
export type { PreviewCardPortalProps } from './preview-card-portal.js';
export type { PreviewCardPositionerProps } from './preview-card-positioner.js';
export type { PreviewCardRootProps } from './preview-card-root.js';
export type { PreviewCardTriggerProps } from './preview-card-trigger.js';
export type { PreviewCardViewportProps } from './preview-card-viewport.js';
export {
  createPreviewCardHandle,
  PreviewCardArrow,
  PreviewCardBackdrop,
  PreviewCardPopup,
  PreviewCardPortal,
  PreviewCardPositioner,
  PreviewCardRoot,
  PreviewCardTrigger,
  PreviewCardViewport,
};
