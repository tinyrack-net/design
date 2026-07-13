import {
  type SurfaceOpenChangeDetail,
  surfaceBeforeChangeEventName,
  surfaceChangeEventName,
} from '../../internal/overlay/contract.js';

export const popoverClassName = 'tr-layer';
export const popoverModes = ['auto', 'manual', 'hint'] as const;
export const popoverPlacements = [
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
] as const;

export type PopoverMode = (typeof popoverModes)[number];
export type PopoverPlacement = (typeof popoverPlacements)[number];
export type PopoverOpenChangeReason =
  | 'trigger'
  | 'escape'
  | 'close-button'
  | 'programmatic'
  | 'native-dismiss'
  | 'modal-open'
  | 'ancestor-close'
  | 'anchor-detached';
export type PopoverOpenChangeDetail = SurfaceOpenChangeDetail<PopoverOpenChangeReason>;
export const popoverBeforeChangeEventName = surfaceBeforeChangeEventName;
export const popoverChangeEventName = surfaceChangeEventName;

export const popoverContract = {
  defaultCollisionPadding: 8,
  defaultMode: 'auto',
  defaultOffset: 8,
  defaultPlacement: 'bottom-start',
} as const satisfies {
  defaultCollisionPadding: number;
  defaultMode: PopoverMode;
  defaultOffset: number;
  defaultPlacement: PopoverPlacement;
};
