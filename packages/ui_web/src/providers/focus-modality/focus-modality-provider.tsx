'use client';

import { type ReactNode, useEffect } from 'react';

export const TINYRACK_FOCUS_MODALITY_ATTRIBUTE = 'data-tr-focus-modality';

export type TinyrackFocusModality = 'keyboard' | 'pointer';

type TrackerState = { count: number; teardown: () => void };

const trackers = new WeakMap<Document, TrackerState>();

/**
 * Tracks whether the focus a control currently holds arrived by pointer or by
 * keyboard, and publishes it on the document element for CSS to read.
 *
 * `:focus-visible` cannot answer this on its own. The selector is defined to
 * always match a text-editable element no matter how focus arrived, so a plain
 * mouse click paints the same ring as a Tab press. WCAG only asks for a visible
 * *keyboard* focus indicator, so the ring is suppressed for pointer focus and
 * the modality has to be tracked here.
 *
 * The modality is sampled at `focusin`, not at key time. Typing into a field
 * that was clicked must not pop a ring in mid-sentence, and sampling on focus
 * acquisition is also what lets the keyboard heuristic below stay permissive.
 */
export function setupTinyrackFocusModality(
  documentObject: Document = document,
): () => void {
  const existing = trackers.get(documentObject);
  if (existing) {
    existing.count += 1;
    return () => releaseTinyrackFocusModality(documentObject);
  }

  const root = documentObject.documentElement;
  // Fail toward the ring: until a pointer gesture proves otherwise, focus is
  // treated as keyboard focus.
  let keyboardModality = true;

  const handleKeyDown = (event: KeyboardEvent) => {
    // A modifier combo is usually a browser or OS shortcut rather than in-page
    // keyboard navigation.
    if (event.metaKey || event.altKey || event.ctrlKey) return;
    keyboardModality = true;
  };
  const handlePointerDown = () => {
    keyboardModality = false;
  };
  const handleFocusIn = () => {
    root.setAttribute(
      TINYRACK_FOCUS_MODALITY_ATTRIBUTE,
      keyboardModality ? 'keyboard' : 'pointer',
    );
  };
  const handleWindowBlur = () => {
    // Returning from another tab, devtools, or the address bar is not a pointer
    // gesture inside the page, so reset to the ring-showing default.
    keyboardModality = true;
  };

  const options = { capture: true, passive: true } as const;
  const view = documentObject.defaultView;
  documentObject.addEventListener('keydown', handleKeyDown, options);
  documentObject.addEventListener('pointerdown', handlePointerDown, options);
  documentObject.addEventListener('mousedown', handlePointerDown, options);
  documentObject.addEventListener('touchstart', handlePointerDown, options);
  documentObject.addEventListener('focusin', handleFocusIn, options);
  view?.addEventListener('blur', handleWindowBlur);

  const teardown = () => {
    documentObject.removeEventListener('keydown', handleKeyDown, options);
    documentObject.removeEventListener('pointerdown', handlePointerDown, options);
    documentObject.removeEventListener('mousedown', handlePointerDown, options);
    documentObject.removeEventListener('touchstart', handlePointerDown, options);
    documentObject.removeEventListener('focusin', handleFocusIn, options);
    view?.removeEventListener('blur', handleWindowBlur);
    root.removeAttribute(TINYRACK_FOCUS_MODALITY_ATTRIBUTE);
  };

  trackers.set(documentObject, { count: 1, teardown });
  return () => releaseTinyrackFocusModality(documentObject);
}

function releaseTinyrackFocusModality(documentObject: Document) {
  const state = trackers.get(documentObject);
  if (!state) return;
  state.count -= 1;
  if (state.count > 0) return;
  trackers.delete(documentObject);
  state.teardown();
}

export function getTinyrackFocusModality(
  documentObject: Document = document,
): TinyrackFocusModality | undefined {
  const value = documentObject.documentElement.getAttribute(
    TINYRACK_FOCUS_MODALITY_ATTRIBUTE,
  );
  return value === 'keyboard' || value === 'pointer' ? value : undefined;
}

/**
 * Installs the tracker for as long as the calling component is mounted. Every
 * control whose focus emphasis depends on the modality calls this, and the
 * refcount keeps a single set of listeners per document.
 */
export function useTinyrackFocusModality() {
  useEffect(() => setupTinyrackFocusModality(), []);
}

export type TRFocusModalityProviderProps = { children?: ReactNode };

/**
 * Optional for consumers of the React components, which install the tracker
 * themselves. Useful when only the CSS is used, or when the tracker should run
 * before the first control mounts.
 */
export function TRFocusModalityProvider({ children }: TRFocusModalityProviderProps) {
  useTinyrackFocusModality();
  return children;
}
