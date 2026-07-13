import type { SurfaceOpenChangeReason } from './contract.js';
import { updateDocumentState } from './document-state.js';
import { createFocusController, mergeUniqueElements } from './focus.js';
import { isSurfaceOpen } from './native.js';
import { SurfaceStack } from './stack.js';
import type { SurfaceEntry, SurfaceKind } from './types.js';

export type SurfaceRoot = Document | ShadowRoot;

const coordinators = new WeakMap<SurfaceRoot, OverlayCoordinator>();

function closestSurface(element: Element | null) {
  return (
    element?.closest<HTMLElement>('[data-tr-overlay], .tr-modal, .tr-layer') ?? null
  );
}

export class OverlayCoordinator {
  readonly document: Document;
  readonly root: SurfaceRoot;
  readonly stack = new SurfaceStack();
  private readonly focus;

  constructor(root: SurfaceRoot) {
    this.root = root;
    this.document = root.nodeType === 9 ? (root as Document) : root.ownerDocument!;
    this.focus = createFocusController(this.document, closestSurface);
  }

  createEntry(
    element: HTMLElement,
    kind: SurfaceKind,
    source: HTMLElement | null,
    close: SurfaceEntry['close'],
  ): SurfaceEntry {
    const active = this.document.activeElement as HTMLElement | null;
    const directParent = this.findParent(source ?? active);
    return {
      cleanupPositioning: null,
      close,
      element,
      kind,
      lastFocused: null,
      parent:
        kind === 'modal'
          ? this.nearestModal(directParent)
          : (directParent?.element ?? null),
      restoreCandidates: mergeUniqueElements([
        source,
        active,
        ...this.stack.entries
          .slice()
          .reverse()
          .flatMap((entry) => [entry.lastFocused, entry.source]),
      ]),
      source,
    };
  }

  register(entry: SurfaceEntry) {
    if (!this.stack.add(entry)) return false;
    entry.element.setAttribute('data-tr-managed', 'true');
    updateDocumentState(this.document, this.stack.entries);
    return true;
  }

  unregister(entry: SurfaceEntry, restoreFocus = true) {
    if (!this.stack.remove(entry)) return false;
    entry.cleanupPositioning?.();
    entry.element.removeAttribute('data-topmost');
    entry.element.removeAttribute('data-tr-managed');
    updateDocumentState(this.document, this.stack.entries);
    if (restoreFocus)
      queueMicrotask(() => this.focus.restore(entry, this.stack.entries));
    return true;
  }

  closeDescendants(element: HTMLElement) {
    for (const entry of this.stack
      .snapshot()
      .filter((candidate) => this.isDescendant(candidate, element))
      .reverse()) {
      entry.close('ancestor-close');
    }
  }

  closeKind(kind: SurfaceKind, reason: SurfaceOpenChangeReason) {
    for (const entry of this.stack
      .snapshot()
      .filter((candidate) => candidate.kind === kind)
      .reverse()) {
      entry.close(reason);
    }
  }

  find(element: HTMLElement) {
    return this.stack.get(element);
  }

  findSource(element: HTMLElement, attribute: 'commandfor' | 'popovertarget') {
    if (element.id.length === 0) return null;
    return (
      Array.from(this.root.querySelectorAll<HTMLElement>(`[${attribute}]`)).find(
        (trigger) => trigger.getAttribute(attribute) === element.id,
      ) ?? null
    );
  }

  prune(kind: SurfaceKind) {
    for (const entry of this.stack
      .snapshot()
      .filter((candidate) => candidate.kind === kind)
      .reverse()) {
      if (!isSurfaceOpen(entry.element)) this.unregister(entry);
    }
  }

  top() {
    return this.stack.at(-1);
  }

  trackFocus(event: FocusEvent) {
    this.focus.track(event, this.stack.entries);
  }

  private findParent(source: HTMLElement | null) {
    if (source === null) return null;
    return (
      this.stack.entries
        .slice()
        .reverse()
        .find((entry) => entry.element.contains(source)) ?? null
    );
  }

  private nearestModal(entry: SurfaceEntry | null) {
    let current = entry;
    while (current !== null) {
      if (current.kind === 'modal') return current.element;
      current = current.parent === null ? null : this.find(current.parent);
    }
    return null;
  }

  private isDescendant(entry: SurfaceEntry, ancestor: HTMLElement) {
    let parent = entry.parent;
    while (parent !== null) {
      if (parent === ancestor) return true;
      parent = this.find(parent)?.parent ?? null;
    }
    return false;
  }
}

export function getOverlayCoordinator(root: SurfaceRoot) {
  let coordinator = coordinators.get(root);
  if (coordinator === undefined) {
    coordinator = new OverlayCoordinator(root);
    coordinators.set(root, coordinator);
  }
  return coordinator;
}
