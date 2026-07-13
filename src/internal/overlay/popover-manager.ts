import {
  type PopoverOpenChangeReason,
  popoverClassName,
} from '../../components/popover/contract.js';
import {
  type SurfaceOpenChangeReason,
  surfaceBeforeChangeEventName,
  surfaceChangeEventName,
} from './contract.js';
import { getOverlayCoordinator, type SurfaceRoot } from './coordinator.js';
import { createSurfaceChangeEvent, createSurfaceDetail } from './events.js';
import {
  isHTMLElement,
  isPopover,
  isPopoverOpen,
  supportsPopoverCommands,
} from './native.js';
import { dataBoolean } from './options.js';
import { createPopoverPositioner } from './positioning.js';

export type PopoverTarget = string | HTMLElement;
export type PopoverManager = {
  close: (
    target: PopoverTarget,
    options?: { reason?: PopoverOpenChangeReason },
  ) => boolean;
  destroy: () => void;
  open: (
    target: PopoverTarget,
    options?: { reason?: PopoverOpenChangeReason; source?: HTMLElement | null },
  ) => boolean;
  toggle: (
    target: PopoverTarget,
    options?: { reason?: PopoverOpenChangeReason; source?: HTMLElement | null },
  ) => boolean;
};

const managers = new WeakMap<SurfaceRoot, SharedPopoverManager>();

class SharedPopoverManager {
  private readonly root: SurfaceRoot;
  private readonly coordinator;
  private readonly pendingReasons = new WeakMap<HTMLElement, PopoverOpenChangeReason>();
  private readonly synchronizing = new WeakSet<HTMLElement>();
  private observer: MutationObserver | null = null;
  private references = 0;

  constructor(root: SurfaceRoot) {
    this.root = root;
    this.coordinator = getOverlayCoordinator(root);
  }

  acquire() {
    this.references += 1;
    if (this.references === 1) this.connect();
  }

  release() {
    this.references = Math.max(0, this.references - 1);
    if (this.references === 0) this.disconnect();
  }

  open(
    target: PopoverTarget,
    options: { reason?: PopoverOpenChangeReason; source?: HTMLElement | null } = {},
  ) {
    const popover = this.resolve(target);
    if (popover === null || isPopoverOpen(popover)) return popover !== null;
    const reason = options.reason ?? 'programmatic';
    const source =
      options.source ?? this.coordinator.findSource(popover, 'popovertarget');
    if (!this.dispatchBefore(popover, true, reason, source)) return false;

    this.synchronizing.add(popover);
    try {
      popover.showPopover(source === null ? undefined : { source });
    } catch {
      return false;
    } finally {
      queueMicrotask(() => this.synchronizing.delete(popover));
    }
    this.register(popover, source);
    this.dispatchChange(popover, true, reason, source);
    return true;
  }

  close(target: PopoverTarget, options: { reason?: PopoverOpenChangeReason } = {}) {
    const popover = this.resolve(target);
    return (
      popover !== null && this.closeElement(popover, options.reason ?? 'programmatic')
    );
  }

  toggle(
    target: PopoverTarget,
    options: { reason?: PopoverOpenChangeReason; source?: HTMLElement | null } = {},
  ) {
    const popover = this.resolve(target);
    if (popover === null) return false;
    return isPopoverOpen(popover)
      ? this.closeElement(popover, options.reason ?? 'trigger')
      : this.open(
          popover,
          options.source === undefined
            ? { reason: options.reason ?? 'trigger' }
            : { reason: options.reason ?? 'trigger', source: options.source },
        );
  }

  private connect() {
    this.root.addEventListener('click', this.handleClick as EventListener, true);
    this.root.addEventListener('keydown', this.handleKeyDown as EventListener, true);
    this.root.addEventListener('toggle', this.handleToggle as EventListener, true);
    this.root.addEventListener('focusin', this.handleFocusIn as EventListener, true);
    const Observer = this.coordinator.document.defaultView?.MutationObserver;
    this.observer = Observer === undefined ? null : new Observer(this.handleMutations);
    this.observer?.observe(
      this.root.nodeType === 9 ? this.coordinator.document.documentElement : this.root,
      {
        childList: true,
        subtree: true,
      },
    );
    queueMicrotask(() => {
      for (const popover of this.root.querySelectorAll<HTMLElement>(
        `.${popoverClassName}:popover-open`,
      )) {
        if (this.coordinator.find(popover) === null) {
          const source = this.coordinator.findSource(popover, 'popovertarget');
          this.register(popover, source);
          this.dispatchChange(
            popover,
            true,
            source === null ? 'native-dismiss' : 'trigger',
            source,
          );
        }
      }
      for (const popover of this.root.querySelectorAll<HTMLElement>(
        `.${popoverClassName}[data-default-open="true"]`,
      )) {
        this.open(popover, {
          source: this.coordinator.findSource(popover, 'popovertarget'),
        });
      }
    });
  }

  private disconnect() {
    this.root.removeEventListener('click', this.handleClick as EventListener, true);
    this.root.removeEventListener('keydown', this.handleKeyDown as EventListener, true);
    this.root.removeEventListener('toggle', this.handleToggle as EventListener, true);
    this.root.removeEventListener('focusin', this.handleFocusIn as EventListener, true);
    this.observer?.disconnect();
    this.observer = null;
    for (const entry of this.coordinator.stack
      .snapshot()
      .filter((candidate) => candidate.kind === 'popover')
      .reverse()) {
      try {
        if (isPopoverOpen(entry.element)) entry.element.hidePopover();
      } catch {}
      this.coordinator.unregister(entry, false);
    }
  }

  private readonly handleClick = (event: Event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest<HTMLElement>('[popovertarget]');
    if (trigger !== null) {
      const popover = this.resolve(trigger.getAttribute('popovertarget') ?? '');
      if (popover === null) return;
      const action = trigger.getAttribute('popovertargetaction') ?? 'toggle';
      if (action === 'hide') this.pendingReasons.set(popover, 'close-button');
      if (
        supportsPopoverCommands(this.coordinator.document) ||
        trigger.dataset['trReactTrigger'] === 'true'
      )
        return;
      event.preventDefault();
      if (action === 'show') this.open(popover, { reason: 'trigger', source: trigger });
      else if (action === 'hide') this.closeElement(popover, 'close-button');
      else this.toggle(popover, { reason: 'trigger', source: trigger });
      return;
    }

    const closeTrigger = event.target.closest<HTMLElement>('[data-tr-overlay-close]');
    const popover =
      closeTrigger === null
        ? null
        : closeTrigger.closest<HTMLElement>(`.${popoverClassName}[popover]`);
    if (popover !== null) {
      event.preventDefault();
      this.closeElement(popover, 'close-button');
    }
  };

  private readonly handleKeyDown = (event: Event) => {
    if (!(event instanceof KeyboardEvent) || event.key !== 'Escape') return;
    this.coordinator.prune('popover');
    const top = this.coordinator.top();
    if (top?.kind !== 'popover') return;
    if (!dataBoolean(top.element, 'closeOnEscape', true)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.closeElement(top.element, 'escape');
  };

  private readonly handleToggle = (event: Event) => {
    if (!(event.target instanceof HTMLElement) || !isPopover(event.target)) return;
    const popover = event.target;
    const entry = this.coordinator.find(popover);
    if (isPopoverOpen(popover) && entry === null) {
      const toggleSource = (event as ToggleEvent).source;
      const source = isHTMLElement(toggleSource)
        ? toggleSource
        : this.coordinator.findSource(popover, 'popovertarget');
      this.register(popover, source);
      this.dispatchChange(
        popover,
        true,
        source === null ? 'native-dismiss' : 'trigger',
        source,
      );
    } else if (
      !isPopoverOpen(popover) &&
      entry !== null &&
      !this.synchronizing.has(popover)
    ) {
      const reason = this.pendingReasons.get(popover) ?? 'native-dismiss';
      this.pendingReasons.delete(popover);
      this.coordinator.closeDescendants(popover);
      this.coordinator.unregister(entry);
      this.dispatchChange(popover, false, reason, entry.source);
    }
  };

  private readonly handleFocusIn = (event: Event) => {
    this.coordinator.trackFocus(event as FocusEvent);
  };

  private readonly handleMutations = () => {
    for (const entry of this.coordinator.stack
      .snapshot()
      .filter((candidate) => candidate.kind === 'popover')
      .reverse()) {
      if (!entry.element.isConnected) {
        this.coordinator.unregister(entry, false);
      } else if (entry.source !== null && !entry.source.isConnected) {
        this.closeElement(entry.element, 'anchor-detached');
      }
    }
  };

  private register(popover: HTMLElement, source: HTMLElement | null) {
    const entry = this.coordinator.createEntry(popover, 'popover', source, (reason) =>
      this.closeElement(popover, reason),
    );
    if (this.coordinator.register(entry)) {
      entry.cleanupPositioning = createPopoverPositioner(entry, (element) =>
        this.coordinator.findSource(element, 'popovertarget'),
      );
    }
    return entry;
  }

  private closeElement(popover: HTMLElement, reason: SurfaceOpenChangeReason) {
    const entry = this.coordinator.find(popover);
    if (entry === null && !isPopoverOpen(popover)) return true;
    this.coordinator.closeDescendants(popover);
    const source = entry?.source ?? null;
    if (!this.dispatchBefore(popover, false, reason, source)) return false;
    this.synchronizing.add(popover);
    try {
      if (isPopoverOpen(popover)) popover.hidePopover();
    } catch {
      return false;
    } finally {
      queueMicrotask(() => this.synchronizing.delete(popover));
    }
    if (entry !== null) this.coordinator.unregister(entry);
    this.dispatchChange(popover, false, reason, source);
    return true;
  }

  private resolve(target: PopoverTarget) {
    const element =
      typeof target === 'string' ? this.root.getElementById(target) : target;
    return element !== null && isPopover(element) ? element : null;
  }

  private dispatchBefore(
    popover: HTMLElement,
    open: boolean,
    reason: SurfaceOpenChangeReason,
    source: HTMLElement | null,
  ) {
    return popover.dispatchEvent(
      createSurfaceChangeEvent(
        this.coordinator.document,
        surfaceBeforeChangeEventName,
        createSurfaceDetail(popover, open, reason, source),
        true,
      ),
    );
  }

  private dispatchChange(
    popover: HTMLElement,
    open: boolean,
    reason: SurfaceOpenChangeReason,
    source: HTMLElement | null,
  ) {
    popover.dispatchEvent(
      createSurfaceChangeEvent(
        this.coordinator.document,
        surfaceChangeEventName,
        createSurfaceDetail(popover, open, reason, source),
        false,
      ),
    );
  }
}

export function createPopoverManager(root: SurfaceRoot): PopoverManager {
  let shared = managers.get(root);
  if (shared === undefined) {
    shared = new SharedPopoverManager(root);
    managers.set(root, shared);
  }
  shared.acquire();
  let destroyed = false;
  return {
    close: (target, options) => shared.close(target, options),
    destroy() {
      if (!destroyed) {
        destroyed = true;
        shared.release();
      }
    },
    open: (target, options) => shared.open(target, options),
    toggle: (target, options) => shared.toggle(target, options),
  };
}
