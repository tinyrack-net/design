import type { SurfaceOpenChangeReason } from '../../internal/overlay/contract.js';
import {
  surfaceBeforeChangeEventName,
  surfaceChangeEventName,
} from '../../internal/overlay/contract.js';
import { modalContract } from '../modal/contract.js';
import { popoverContract } from '../popover/contract.js';

/** @deprecated Import Modal contract values from components/modal/contract. */
export {
  type ModalOpenChangeReason,
  type ModalPlacement,
  type ModalSize,
  modalActionClassName,
  modalBackdropClassName,
  modalBodyClassName,
  modalBoxClassName,
  modalClassName,
  modalDescriptionClassName,
  modalHeaderClassName,
  modalPlacements,
  modalSizes,
  modalTitleClassName,
} from '../modal/contract.js';
/** @deprecated Use Popover contract names from components/popover/contract. */
export {
  type PopoverMode as LayerMode,
  type PopoverOpenChangeReason,
  type PopoverPlacement as LayerPlacement,
  popoverClassName as layerClassName,
  popoverModes as layerModes,
  popoverPlacements as layerPlacements,
} from '../popover/contract.js';

/** @deprecated Use ModalOpenChangeReason or PopoverOpenChangeReason. */
export type OverlayOpenChangeReason = SurfaceOpenChangeReason;
/** @deprecated Use ModalOpenChangeDetail or PopoverOpenChangeDetail. */
export type OverlayOpenChangeDetail = {
  open: boolean;
  overlay: HTMLElement;
  reason: OverlayOpenChangeReason;
  source: HTMLElement | null;
};

/** @deprecated Use modalBeforeChangeEventName or popoverBeforeChangeEventName. */
export const overlayBeforeChangeEventName = surfaceBeforeChangeEventName;
/** @deprecated Use modalChangeEventName or popoverChangeEventName. */
export const overlayChangeEventName = surfaceChangeEventName;

/** @deprecated Import modalContract or popoverContract from the dedicated component. */
export const overlayContract = {
  defaultLayerCollisionPadding: popoverContract.defaultCollisionPadding,
  defaultLayerMode: popoverContract.defaultMode,
  defaultLayerOffset: popoverContract.defaultOffset,
  defaultLayerPlacement: popoverContract.defaultPlacement,
  defaultModalPlacement: modalContract.defaultPlacement,
  defaultModalSize: modalContract.defaultSize,
} as const;

declare global {
  interface DOMStringMap {
    closeOnBackdrop?: string;
    closeOnEscape?: string;
    collisionPadding?: string;
    matchAnchorWidth?: string;
    offset?: string;
    overlayTestStyle?: string;
    placement?: string;
    positioned?: string;
    preventScroll?: string;
    theme?: string;
    topmost?: string;
    trManaged?: string;
    trModalOpen?: string;
    trOverlay?: string;
    trOverlayClose?: string;
    trReactTrigger?: string;
  }
}
