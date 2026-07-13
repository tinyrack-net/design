import {
  type ModalOpenChangeReason,
  modalBackdropClassName,
  modalClassName,
} from '../../components/modal/contract.js';
import {
  type SurfaceOpenChangeReason,
  surfaceBeforeChangeEventName,
  surfaceChangeEventName,
} from './contract.js';
import { getOverlayCoordinator, type SurfaceRoot } from './coordinator.js';
import { createSurfaceChangeEvent, createSurfaceDetail } from './events.js';
import {
  isHTMLElement,
  isModal,
  isModalOpen,
  supportsDialogCommands,
} from './native.js';
import { dataBoolean } from './options.js';

export type ModalTarget = string | HTMLDialogElement;
export type ModalManager = {
  close: (target: ModalTarget, options?: { reason?: ModalOpenChangeReason }) => boolean;
  destroy: () => void;
  open: (
    target: ModalTarget,
    options?: { reason?: ModalOpenChangeReason; source?: HTMLElement | null },
  ) => boolean;
  toggle: (
    target: ModalTarget,
    options?: { reason?: ModalOpenChangeReason; source?: HTMLElement | null },
  ) => boolean;
};

const managers = new WeakMap<SurfaceRoot, SharedModalManager>();

class SharedModalManager {
  private readonly root: SurfaceRoot;
  private readonly coordinator;
  private readonly pendingReasons = new WeakMap<
    HTMLDialogElement,
    ModalOpenChangeReason
  >();
  private readonly pendingValues = new WeakMap<HTMLDialogElement, string>();
  private readonly synchronizing = new WeakSet<HTMLDialogElement>();
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
    target: ModalTarget,
    options: { reason?: ModalOpenChangeReason; source?: HTMLElement | null } = {},
  ) {
    const dialog = this.resolve(target);
    if (dialog === null || isModalOpen(dialog)) return dialog !== null;
    const reason = options.reason ?? 'programmatic';
    const source = options.source ?? this.coordinator.findSource(dialog, 'commandfor');
    if (!this.dispatchBefore(dialog, true, reason, source)) return false;

    this.coordinator.closeKind('popover', 'modal-open');
    this.synchronizing.add(dialog);
    try {
      if (dialog.open && !isModalOpen(dialog)) dialog.close();
      dialog.showModal();
    } catch {
      return false;
    } finally {
      queueMicrotask(() => this.synchronizing.delete(dialog));
    }

    this.register(dialog, source);
    this.dispatchChange(dialog, true, reason, source);
    return true;
  }

  close(target: ModalTarget, options: { reason?: ModalOpenChangeReason } = {}) {
    const dialog = this.resolve(target);
    return (
      dialog !== null && this.closeElement(dialog, options.reason ?? 'programmatic')
    );
  }

  toggle(
    target: ModalTarget,
    options: { reason?: ModalOpenChangeReason; source?: HTMLElement | null } = {},
  ) {
    const dialog = this.resolve(target);
    if (dialog === null) return false;
    return isModalOpen(dialog)
      ? this.closeElement(dialog, options.reason ?? 'trigger')
      : this.open(
          dialog,
          options.source === undefined
            ? { reason: options.reason ?? 'trigger' }
            : { reason: options.reason ?? 'trigger', source: options.source },
        );
  }

  private connect() {
    this.root.addEventListener('click', this.handleClick as EventListener, true);
    this.root.addEventListener('cancel', this.handleCancel as EventListener, true);
    this.root.addEventListener('close', this.handleClose as EventListener, true);
    this.root.addEventListener('toggle', this.handleToggle as EventListener, true);
    this.root.addEventListener('focusin', this.handleFocusIn as EventListener, true);
    const Observer = this.coordinator.document.defaultView?.MutationObserver;
    this.observer = Observer === undefined ? null : new Observer(this.handleMutations);
    this.observer?.observe(
      this.root.nodeType === 9 ? this.coordinator.document.documentElement : this.root,
      { childList: true, subtree: true },
    );
    queueMicrotask(() => {
      for (const dialog of this.root.querySelectorAll<HTMLDialogElement>(
        `dialog.${modalClassName}:modal`,
      )) {
        if (this.coordinator.find(dialog) === null) {
          const source = this.coordinator.findSource(dialog, 'commandfor');
          this.register(dialog, source);
          this.dispatchChange(
            dialog,
            true,
            source === null ? 'native-dismiss' : 'trigger',
            source,
          );
        }
      }
      for (const dialog of this.root.querySelectorAll<HTMLDialogElement>(
        `dialog.${modalClassName}[data-default-open="true"]`,
      )) {
        this.open(dialog, {
          source: this.coordinator.findSource(dialog, 'commandfor'),
        });
      }
    });
  }

  private disconnect() {
    this.root.removeEventListener('click', this.handleClick as EventListener, true);
    this.root.removeEventListener('cancel', this.handleCancel as EventListener, true);
    this.root.removeEventListener('close', this.handleClose as EventListener, true);
    this.root.removeEventListener('toggle', this.handleToggle as EventListener, true);
    this.root.removeEventListener('focusin', this.handleFocusIn as EventListener, true);
    this.observer?.disconnect();
    this.observer = null;
    for (const entry of this.coordinator.stack
      .snapshot()
      .filter((candidate) => candidate.kind === 'modal')
      .reverse()) {
      try {
        if ((entry.element as HTMLDialogElement).open)
          (entry.element as HTMLDialogElement).close();
      } catch {}
      this.coordinator.unregister(entry, false);
    }
  }

  private readonly handleClick = (event: Event) => {
    if (!(event.target instanceof Element)) return;
    const backdrop = event.target.closest<HTMLElement>(`.${modalBackdropClassName}`);
    const backdropDialog =
      backdrop === null
        ? null
        : backdrop.closest<HTMLDialogElement>(`dialog.${modalClassName}`);
    if (backdropDialog !== null) {
      if (!dataBoolean(backdropDialog, 'closeOnBackdrop', true)) {
        event.preventDefault();
        return;
      }
      this.pendingReasons.set(backdropDialog, 'backdrop');
    }

    const trigger = event.target.closest<HTMLElement>('[commandfor]');
    if (trigger !== null) {
      const dialog = this.resolve(trigger.getAttribute('commandfor') ?? '');
      if (dialog === null) return;
      const command = trigger.getAttribute('command') ?? 'show-modal';
      const value = trigger instanceof HTMLButtonElement ? trigger.value : '';
      if (dialog.open && (command === 'close' || command === 'request-close')) {
        this.pendingReasons.set(dialog, 'close-button');
      }
      if (dialog.open && command === 'request-close') {
        this.pendingValues.set(dialog, value);
      }
      if (supportsDialogCommands(this.coordinator.document)) {
        if (command === 'show-modal') {
          queueMicrotask(() => {
            if (isModalOpen(dialog) && this.coordinator.find(dialog) === null) {
              this.coordinator.closeKind('popover', 'modal-open');
              this.register(dialog, trigger);
              this.dispatchChange(dialog, true, 'trigger', trigger);
            }
          });
        } else if (dialog.open) {
          queueMicrotask(() => {
            if (dialog.open) {
              this.pendingReasons.delete(dialog);
              this.pendingValues.delete(dialog);
            }
          });
        }
        return;
      }
      if (trigger.dataset['trReactTrigger'] === 'true') return;
      event.preventDefault();
      if (command === 'show-modal')
        this.open(dialog, { reason: 'trigger', source: trigger });
      else if (command === 'request-close' && dialog.open && 'requestClose' in dialog)
        dialog.requestClose(value);
      else if (command === 'close' || command === 'request-close')
        this.closeElement(dialog, 'close-button', value);
      return;
    }

    const closeTrigger = event.target.closest<HTMLElement>('[data-tr-overlay-close]');
    if (closeTrigger === null || backdropDialog !== null) return;
    const dialog = closeTrigger.closest<HTMLDialogElement>(`dialog.${modalClassName}`);
    if (dialog === null) return;
    this.pendingReasons.set(dialog, 'close-button');
    if (closeTrigger.closest('form[method="dialog"]') === null) {
      event.preventDefault();
      this.closeElement(dialog, 'close-button');
    }
  };

  private readonly handleCancel = (event: Event) => {
    if (!(event.target instanceof HTMLDialogElement)) return;
    const reason = this.pendingReasons.get(event.target) ?? 'escape';
    const value = this.pendingValues.get(event.target);
    this.pendingReasons.delete(event.target);
    this.pendingValues.delete(event.target);
    this.coordinator.prune('modal');
    if (
      reason === 'escape' &&
      (this.coordinator.top()?.element !== event.target ||
        !dataBoolean(event.target, 'closeOnEscape', true))
    ) {
      event.preventDefault();
      return;
    }
    const entry = this.coordinator.find(event.target);
    const source = entry?.source ?? null;
    if (!this.dispatchBefore(event.target, false, reason, source)) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    this.closeElement(event.target, reason, value, false);
  };

  private readonly handleClose = (event: Event) => {
    if (
      !(event.target instanceof HTMLDialogElement) ||
      this.synchronizing.has(event.target)
    )
      return;
    const reason = this.pendingReasons.get(event.target) ?? 'native-dismiss';
    this.pendingReasons.delete(event.target);
    this.pendingValues.delete(event.target);
    const entry = this.coordinator.find(event.target);
    if (entry === null) return;
    this.coordinator.closeDescendants(event.target);
    this.coordinator.unregister(entry);
    this.dispatchChange(event.target, false, reason, entry.source);
  };

  private readonly handleToggle = (event: Event) => {
    if (!(event.target instanceof HTMLDialogElement)) return;
    const dialog = event.target;
    const entry = this.coordinator.find(dialog);
    if (isModalOpen(dialog) && entry === null) {
      const toggleSource = (event as ToggleEvent).source;
      const source = isHTMLElement(toggleSource)
        ? toggleSource
        : this.coordinator.findSource(dialog, 'commandfor');
      this.coordinator.closeKind('popover', 'modal-open');
      this.register(dialog, source);
      this.dispatchChange(
        dialog,
        true,
        source === null ? 'native-dismiss' : 'trigger',
        source,
      );
    } else if (
      !isModalOpen(dialog) &&
      entry !== null &&
      !this.synchronizing.has(dialog)
    ) {
      this.handleClose(event);
    }
  };

  private readonly handleFocusIn = (event: Event) => {
    this.coordinator.trackFocus(event as FocusEvent);
  };

  private readonly handleMutations = () => {
    for (const entry of this.coordinator.stack
      .snapshot()
      .filter((candidate) => candidate.kind === 'modal')
      .reverse()) {
      if (!entry.element.isConnected) this.coordinator.unregister(entry, false);
    }
  };

  private register(dialog: HTMLDialogElement, source: HTMLElement | null) {
    const entry = this.coordinator.createEntry(dialog, 'modal', source, (reason) =>
      this.closeElement(dialog, reason),
    );
    this.coordinator.register(entry);
    return entry;
  }

  private closeElement(
    dialog: HTMLDialogElement,
    reason: SurfaceOpenChangeReason,
    value?: string,
    dispatchBefore = true,
  ) {
    this.pendingReasons.delete(dialog);
    this.pendingValues.delete(dialog);
    const entry = this.coordinator.find(dialog);
    if (entry === null && !dialog.open) return true;
    this.coordinator.closeDescendants(dialog);
    const source = entry?.source ?? null;
    if (dispatchBefore && !this.dispatchBefore(dialog, false, reason, source))
      return false;
    this.synchronizing.add(dialog);
    try {
      if (dialog.open) {
        if (value === undefined) dialog.close();
        else dialog.close(value);
      }
    } catch {
      return false;
    } finally {
      queueMicrotask(() => this.synchronizing.delete(dialog));
    }
    if (entry !== null) this.coordinator.unregister(entry);
    this.dispatchChange(dialog, false, reason, source);
    return true;
  }

  private resolve(target: ModalTarget) {
    const element =
      typeof target === 'string' ? this.root.getElementById(target) : target;
    return element !== null && isModal(element) ? element : null;
  }

  private dispatchBefore(
    dialog: HTMLDialogElement,
    open: boolean,
    reason: SurfaceOpenChangeReason,
    source: HTMLElement | null,
  ) {
    return dialog.dispatchEvent(
      createSurfaceChangeEvent(
        this.coordinator.document,
        surfaceBeforeChangeEventName,
        createSurfaceDetail(dialog, open, reason, source),
        true,
      ),
    );
  }

  private dispatchChange(
    dialog: HTMLDialogElement,
    open: boolean,
    reason: SurfaceOpenChangeReason,
    source: HTMLElement | null,
  ) {
    dialog.dispatchEvent(
      createSurfaceChangeEvent(
        this.coordinator.document,
        surfaceChangeEventName,
        createSurfaceDetail(dialog, open, reason, source),
        false,
      ),
    );
  }
}

export function createModalManager(root: SurfaceRoot): ModalManager {
  let shared = managers.get(root);
  if (shared === undefined) {
    shared = new SharedModalManager(root);
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
