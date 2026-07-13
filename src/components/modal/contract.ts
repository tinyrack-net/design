import {
  type SurfaceOpenChangeDetail,
  surfaceBeforeChangeEventName,
  surfaceChangeEventName,
} from '../../internal/overlay/contract.js';

export const modalClassName = 'tr-modal';
export const modalBoxClassName = 'tr-modal-box';
export const modalHeaderClassName = 'tr-modal-header';
export const modalTitleClassName = 'tr-modal-title';
export const modalDescriptionClassName = 'tr-modal-description';
export const modalBodyClassName = 'tr-modal-body';
export const modalActionClassName = 'tr-modal-action';
export const modalBackdropClassName = 'tr-modal-backdrop';

export const modalPlacements = ['top', 'middle', 'bottom', 'start', 'end'] as const;
export const modalSizes = ['sm', 'md', 'lg', 'full'] as const;

export type ModalPlacement = (typeof modalPlacements)[number];
export type ModalSize = (typeof modalSizes)[number];
export type ModalOpenChangeReason =
  | 'trigger'
  | 'escape'
  | 'backdrop'
  | 'close-button'
  | 'programmatic'
  | 'native-dismiss'
  | 'ancestor-close';
export type ModalOpenChangeDetail = SurfaceOpenChangeDetail<ModalOpenChangeReason>;
export const modalBeforeChangeEventName = surfaceBeforeChangeEventName;
export const modalChangeEventName = surfaceChangeEventName;

export const modalContract = {
  defaultPlacement: 'middle',
  defaultSize: 'md',
} as const satisfies {
  defaultPlacement: ModalPlacement;
  defaultSize: ModalSize;
};
