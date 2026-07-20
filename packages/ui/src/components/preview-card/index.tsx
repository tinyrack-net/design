import { TRPreviewCardArrow } from './preview-card-arrow.js';
import { TRPreviewCardBackdrop } from './preview-card-backdrop.js';
import type { TRPreviewCardHandle as PreviewCardHandleType } from './preview-card-handle.js';
import { createPreviewCardHandle } from './preview-card-handle.js';
import { TRPreviewCardPopup } from './preview-card-popup.js';
import { TRPreviewCardPortal } from './preview-card-portal.js';
import { TRPreviewCardPositioner } from './preview-card-positioner.js';
import { TRPreviewCardRoot } from './preview-card-root.js';
import { TRPreviewCardTrigger } from './preview-card-trigger.js';
import { TRPreviewCardViewport } from './preview-card-viewport.js';

export const TRPreviewCard = {
  Root: TRPreviewCardRoot,
  Portal: TRPreviewCardPortal,
  Trigger: TRPreviewCardTrigger,
  Positioner: TRPreviewCardPositioner,
  Popup: TRPreviewCardPopup,
  Arrow: TRPreviewCardArrow,
  Backdrop: TRPreviewCardBackdrop,
  Viewport: TRPreviewCardViewport,
  createHandle: createPreviewCardHandle as <
    Payload,
  >() => PreviewCardHandleType<Payload>,
} as const;

export type {
  PreviewCardArrowState as TRPreviewCardArrowState,
  PreviewCardBackdropState as TRPreviewCardBackdropState,
  PreviewCardPopupState as TRPreviewCardPopupState,
  PreviewCardPortalState as TRPreviewCardPortalState,
  PreviewCardPositionerState as TRPreviewCardPositionerState,
  PreviewCardRootState as TRPreviewCardRootState,
  PreviewCardTriggerState as TRPreviewCardTriggerState,
  PreviewCardViewportState as TRPreviewCardViewportState,
} from '@base-ui/react/preview-card';
export type { TRPreviewCardArrowProps } from './preview-card-arrow.js';
export type { TRPreviewCardBackdropProps } from './preview-card-backdrop.js';
export type { TRPreviewCardHandle } from './preview-card-handle.js';
export type { TRPreviewCardPopupProps } from './preview-card-popup.js';
export type { TRPreviewCardPortalProps } from './preview-card-portal.js';
export type { TRPreviewCardPositionerProps } from './preview-card-positioner.js';
export type { TRPreviewCardRootProps } from './preview-card-root.js';
export type { TRPreviewCardTriggerProps } from './preview-card-trigger.js';
export type { TRPreviewCardViewportProps } from './preview-card-viewport.js';
export {
  createPreviewCardHandle,
  TRPreviewCardArrow,
  TRPreviewCardBackdrop,
  TRPreviewCardPopup,
  TRPreviewCardPortal,
  TRPreviewCardPositioner,
  TRPreviewCardRoot,
  TRPreviewCardTrigger,
  TRPreviewCardViewport,
};
