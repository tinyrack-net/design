import { modalTitleClassName } from '../../components/modal/contract.js';
import { isHTMLElement, isSurfaceOpen } from './native.js';
import type { SurfaceEntry } from './types.js';

export function mergeUniqueElements(elements: Array<HTMLElement | null>) {
  return Array.from(
    new Set(elements.filter((element): element is HTMLElement => element !== null)),
  );
}

export function createFocusController(
  document: Document,
  closestSurface: (element: Element | null) => HTMLElement | null,
) {
  function track(event: FocusEvent, entries: readonly SurfaceEntry[]) {
    if (!isHTMLElement(event.target)) return;
    for (const entry of entries.slice().reverse()) {
      if (entry.element.contains(event.target)) {
        entry.lastFocused = event.target;
        return;
      }
    }
  }

  function isFocusCandidate(element: HTMLElement) {
    if (
      !element.isConnected ||
      element.hidden ||
      element.getAttribute('aria-hidden') === 'true' ||
      element.closest('[inert]') !== null ||
      element.getClientRects().length === 0
    )
      return false;

    if (
      (element instanceof HTMLButtonElement ||
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement) &&
      element.disabled
    )
      return false;

    const surface = closestSurface(element);
    return surface === null || isSurfaceOpen(surface);
  }

  function restore(entry: SurfaceEntry, entries: readonly SurfaceEntry[]) {
    const active = isHTMLElement(document.activeElement)
      ? document.activeElement
      : null;
    if (
      active !== null &&
      active !== document.body &&
      !entry.element.contains(active) &&
      isFocusCandidate(active)
    )
      return;

    const topModal = entries
      .slice()
      .reverse()
      .find((candidate) => candidate.kind === 'modal');
    mergeUniqueElements([
      ...entry.restoreCandidates,
      topModal?.lastFocused ?? null,
      topModal?.element.querySelector<HTMLElement>(`.${modalTitleClassName}`) ?? null,
    ])
      .find(isFocusCandidate)
      ?.focus({ preventScroll: true });
  }

  return { isFocusCandidate, restore, track };
}
