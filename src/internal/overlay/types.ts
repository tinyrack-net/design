import type { SurfaceOpenChangeReason } from './contract.js';

export type SurfaceKind = 'modal' | 'popover';

export type SurfaceEntry = {
  cleanupPositioning: (() => void) | null;
  close: (reason: SurfaceOpenChangeReason) => boolean;
  element: HTMLElement;
  kind: SurfaceKind;
  lastFocused: HTMLElement | null;
  parent: HTMLElement | null;
  restoreCandidates: HTMLElement[];
  source: HTMLElement | null;
};
