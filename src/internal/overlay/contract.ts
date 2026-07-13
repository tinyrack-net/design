export type SurfaceOpenChangeReason =
  | 'trigger'
  | 'escape'
  | 'backdrop'
  | 'close-button'
  | 'programmatic'
  | 'native-dismiss'
  | 'modal-open'
  | 'ancestor-close'
  | 'anchor-detached';

export type SurfaceOpenChangeDetail<
  Reason extends SurfaceOpenChangeReason = SurfaceOpenChangeReason,
> = {
  open: boolean;
  overlay: HTMLElement;
  reason: Reason;
  source: HTMLElement | null;
};

export const surfaceBeforeChangeEventName = 'tinyrack:overlay-beforechange' as const;
export const surfaceChangeEventName = 'tinyrack:overlay-change' as const;
