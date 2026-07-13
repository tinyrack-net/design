import type { SurfaceOpenChangeDetail, SurfaceOpenChangeReason } from './contract.js';

export function createSurfaceChangeEvent(
  document: Document,
  type: string,
  detail: SurfaceOpenChangeDetail,
  cancelable: boolean,
) {
  const CustomEventConstructor = document.defaultView?.CustomEvent ?? CustomEvent;
  return new CustomEventConstructor<SurfaceOpenChangeDetail>(type, {
    bubbles: true,
    cancelable,
    composed: true,
    detail,
  });
}

export function createSurfaceDetail(
  overlay: HTMLElement,
  open: boolean,
  reason: SurfaceOpenChangeReason,
  source: HTMLElement | null,
): SurfaceOpenChangeDetail {
  return { open, overlay, reason, source };
}
