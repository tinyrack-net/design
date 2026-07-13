import type { SurfaceOpenChangeReason } from '../../internal/overlay/contract.js';
import { createModalManager } from '../modal/dom.js';
import { createPopoverManager } from '../popover/dom.js';

/** @deprecated Use ModalTarget or PopoverTarget from the dedicated DOM module. */
export type OverlayTarget = string | HTMLElement;
/** @deprecated Use ModalRoot or PopoverRoot from the dedicated DOM module. */
export type OverlayRoot = Document | ShadowRoot;
/** @deprecated Use the open options accepted by the dedicated manager. */
export type OverlayOpenOptions = {
  reason?: SurfaceOpenChangeReason;
  source?: HTMLElement | null;
};
/** @deprecated Use the close options accepted by the dedicated manager. */
export type OverlayCloseOptions = { reason?: SurfaceOpenChangeReason };
/** @deprecated Use ModalManager or PopoverManager. */
export type OverlayManager = {
  close: (target: OverlayTarget, options?: OverlayCloseOptions) => boolean;
  destroy: () => void;
  open: (target: OverlayTarget, options?: OverlayOpenOptions) => boolean;
  toggle: (target: OverlayTarget, options?: OverlayOpenOptions) => boolean;
};

/** @deprecated Use createModalManager or createPopoverManager. */
export function createOverlayManager(root: OverlayRoot): OverlayManager {
  const modal = createModalManager(root);
  const popover = createPopoverManager(root);
  const resolve = (target: OverlayTarget) =>
    typeof target === 'string' ? root.getElementById(target) : target;

  function route(
    action: 'close' | 'open' | 'toggle',
    target: OverlayTarget,
    options?: OverlayOpenOptions,
  ) {
    const element = resolve(target);
    if (element === null) {
      return false;
    }
    if (element instanceof HTMLDialogElement) {
      return modal[action](element, options as never);
    }
    if (element instanceof HTMLElement && element.hasAttribute('popover')) {
      return popover[action](element, options as never);
    }
    return action === 'close';
  }

  return {
    close: (target, options) => route('close', target, options),
    destroy() {
      modal.destroy();
      popover.destroy();
    },
    open: (target, options) => route('open', target, options),
    toggle: (target, options) => route('toggle', target, options),
  };
}

export type {
  LayerMode,
  LayerPlacement,
  ModalPlacement,
  ModalSize,
  OverlayOpenChangeDetail,
  OverlayOpenChangeReason,
} from './contract.js';
