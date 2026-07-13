'use client';

import type { SurfaceOpenChangeReason } from '../../internal/overlay/contract.js';
import type {
  OpenProps as GenericOpenProps,
  OpenChangeCallback,
} from '../../internal/react/state.js';

/** @deprecated Import Modal types from components/modal/react. */
export type OverlayOpenChangeCallback = OpenChangeCallback<SurfaceOpenChangeReason>;
/** @deprecated Import ModalOpenProps or PopoverOpenProps from the dedicated adapter. */
export type OpenProps = GenericOpenProps<SurfaceOpenChangeReason>;

/** @deprecated Import Modal contract types from components/modal/contract. */
export type {
  ModalOpenChangeReason,
  ModalPlacement,
  ModalSize,
} from '../modal/contract.js';
/** @deprecated Import Modal parts from components/modal/react. */
export {
  Modal,
  ModalAction,
  type ModalActionProps,
  ModalBackdrop,
  type ModalBackdropProps,
  ModalBody,
  type ModalBodyProps,
  ModalBox,
  type ModalBoxProps,
  ModalClose,
  type ModalCloseProps,
  ModalContent,
  type ModalContentProps,
  ModalDescription,
  type ModalDescriptionProps,
  ModalHeader,
  type ModalHeaderProps,
  type ModalOpenProps,
  type ModalProps,
  ModalTitle,
  type ModalTitleProps,
  ModalTrigger,
  type ModalTriggerProps,
} from '../modal/react.js';
/** @deprecated Use PopoverMode and PopoverPlacement from components/popover/contract. */
export type {
  PopoverMode as LayerMode,
  PopoverPlacement as LayerPlacement,
} from '../popover/contract.js';
/** @deprecated Use the corresponding Popover parts from components/popover/react. */
export {
  Popover as Layer,
  PopoverAnchor as LayerAnchor,
  type PopoverAnchorProps as LayerAnchorProps,
  PopoverClose as LayerClose,
  type PopoverCloseProps as LayerCloseProps,
  PopoverContent as LayerContent,
  type PopoverContentProps as LayerContentProps,
  type PopoverProps as LayerProps,
  PopoverTrigger as LayerTrigger,
  type PopoverTriggerProps as LayerTriggerProps,
} from '../popover/react.js';
