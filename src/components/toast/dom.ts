import {
  type ToastChangeDetail,
  type ToastChangeReason,
  type ToastPosition,
  type ToastVariant,
  toastActionClassName,
  toastChangeEventName,
  toastClassName,
  toastCloseClassName,
  toastContract,
  toastDescriptionClassName,
  toastTitleClassName,
  toastViewportClassName,
} from './contract.js';

export type ToastManagerRoot = Document | ShadowRoot | HTMLElement;

export type ToastAction = {
  label: string;
  onAction?: (id: string) => void;
};

export type ToastOptions = {
  action?: ToastAction;
  closeLabel?: string;
  description?: string;
  duration?: number;
  id?: string;
  position?: ToastPosition;
  title: string;
  variant?: ToastVariant;
};

export type ToastUpdate = Partial<Omit<ToastOptions, 'id'>>;

export type ToastManager = {
  destroy: () => void;
  dismiss: (id?: string) => void;
  show: (options: ToastOptions) => string;
  update: (id: string, options: ToastUpdate) => boolean;
};

type ToastRecord = {
  element: HTMLElement;
  id: string;
  options: Required<Pick<ToastOptions, 'duration' | 'position' | 'variant'>> &
    ToastOptions;
  remaining: number;
  startedAt: number;
  timer: ReturnType<typeof setTimeout> | null;
};

let nextToastId = 0;

function ownerDocument(root: ToastManagerRoot) {
  return root instanceof Document ? root : root.ownerDocument;
}

function queryScope(root: ToastManagerRoot) {
  return root;
}

function appendTarget(root: ToastManagerRoot) {
  return root instanceof Document ? root.body : root;
}

function now(document: Document) {
  return document.defaultView?.performance.now() ?? Date.now();
}

function dispatch(root: ToastManagerRoot, id: string, reason: ToastChangeReason) {
  const document = ownerDocument(root);
  const ViewCustomEvent = document.defaultView?.CustomEvent ?? CustomEvent;
  const target = root instanceof Document ? document : root;
  target.dispatchEvent(
    new ViewCustomEvent<ToastChangeDetail>(toastChangeEventName, {
      bubbles: true,
      detail: { id, reason },
    }),
  );
}

function normalizedOptions(options: ToastOptions): ToastRecord['options'] {
  return {
    ...options,
    duration: options.duration ?? toastContract.defaultDuration,
    position: options.position ?? toastContract.defaultPosition,
    variant: options.variant ?? 'neutral',
  };
}

export function createToastManager(root: ToastManagerRoot): ToastManager {
  const document = ownerDocument(root);
  const records = new Map<string, ToastRecord>();
  const createdViewports = new Set<HTMLElement>();
  let windowPaused = document.visibilityState === 'hidden';

  function viewport(position: ToastPosition) {
    const selector = `[data-tr-toast-viewport][data-position="${position}"]`;
    let element =
      root instanceof HTMLElement && root.matches(selector)
        ? root
        : queryScope(root).querySelector<HTMLElement>(selector);
    if (element === null) {
      element = document.createElement('div');
      element.className = toastViewportClassName;
      element.dataset['position'] = position;
      element.dataset['trToastViewport'] = 'true';
      element.setAttribute('aria-label', 'Notifications');
      element.setAttribute('role', 'region');
      element.setAttribute('popover', 'manual');
      appendTarget(root).append(element);
      createdViewports.add(element);
    }
    if (!element.matches(':popover-open')) {
      try {
        element.showPopover();
      } catch {
        element.dataset['open'] = 'true';
      }
    }
    return element;
  }

  function render(record: ToastRecord) {
    const { element, options } = record;
    element.replaceChildren();
    element.dataset['variant'] = options.variant;
    element.dataset['toastId'] = record.id;
    element.setAttribute('role', options.variant === 'danger' ? 'alert' : 'status');

    const body = document.createElement('div');
    const title = document.createElement('div');
    title.className = toastTitleClassName;
    title.textContent = options.title;
    body.append(title);
    if (options.description !== undefined) {
      const description = document.createElement('div');
      description.className = toastDescriptionClassName;
      description.textContent = options.description;
      body.append(description);
    }
    element.append(body);

    if (options.action !== undefined) {
      const action = document.createElement('button');
      action.className = toastActionClassName;
      action.dataset['trToastAction'] = 'true';
      action.textContent = options.action.label;
      action.type = 'button';
      element.append(action);
    }

    const close = document.createElement('button');
    close.className = toastCloseClassName;
    close.dataset['trToastClose'] = 'true';
    close.setAttribute('aria-label', options.closeLabel ?? 'Dismiss notification');
    close.textContent = '×';
    close.type = 'button';
    element.append(close);
  }

  function paused(record: ToastRecord) {
    return (
      windowPaused ||
      record.element.matches(':hover') ||
      record.element.contains(document.activeElement)
    );
  }

  function stopTimer(record: ToastRecord) {
    if (record.timer === null) {
      return;
    }
    clearTimeout(record.timer);
    record.timer = null;
    record.remaining = Math.max(
      0,
      record.remaining - (now(document) - record.startedAt),
    );
  }

  function startTimer(record: ToastRecord) {
    if (
      record.timer !== null ||
      record.options.duration <= 0 ||
      !Number.isFinite(record.options.duration) ||
      paused(record)
    ) {
      return;
    }
    record.startedAt = now(document);
    record.timer = setTimeout(() => dismiss(record.id, 'timeout'), record.remaining);
  }

  function dismiss(id?: string, reason: ToastChangeReason = 'dismiss') {
    if (id === undefined) {
      for (const toastId of [...records.keys()]) {
        dismiss(toastId, reason);
      }
      return;
    }
    const record = records.get(id);
    if (record === undefined) {
      return;
    }
    stopTimer(record);
    const parent = record.element.parentElement;
    record.element.remove();
    records.delete(id);
    if (parent !== null && parent.childElementCount === 0) {
      try {
        parent.hidePopover();
      } catch {
        parent.dataset['open'] = 'false';
      }
    }
    dispatch(root, id, reason);
  }

  function update(id: string, patch: ToastUpdate) {
    const record = records.get(id);
    if (record === undefined) {
      return false;
    }
    stopTimer(record);
    const oldPosition = record.options.position;
    record.options = normalizedOptions({ ...record.options, ...patch, id });
    record.remaining = record.options.duration;
    render(record);
    if (record.options.position !== oldPosition) {
      viewport(record.options.position).append(record.element);
    }
    startTimer(record);
    dispatch(root, id, 'update');
    return true;
  }

  function show(options: ToastOptions) {
    const id = options.id ?? `tr-toast-${++nextToastId}`;
    if (records.has(id)) {
      update(id, options);
      return id;
    }
    const normalized = normalizedOptions({ ...options, id });
    const element = document.createElement('article');
    element.className = toastClassName;
    const record: ToastRecord = {
      element,
      id,
      options: normalized,
      remaining: normalized.duration,
      startedAt: 0,
      timer: null,
    };
    records.set(id, record);
    render(record);
    viewport(normalized.position).append(element);
    startTimer(record);
    dispatch(root, id, 'show');
    return id;
  }

  function pauseToast(element: Element | null) {
    const toast = element?.closest<HTMLElement>('[data-toast-id]');
    const record =
      toast === null || toast === undefined
        ? undefined
        : records.get(toast.dataset['toastId']!);
    if (record !== undefined) {
      stopTimer(record);
    }
  }

  function resumeToast(element: Element | null) {
    const toast = element?.closest<HTMLElement>('[data-toast-id]');
    const record =
      toast === null || toast === undefined
        ? undefined
        : records.get(toast.dataset['toastId']!);
    if (record !== undefined) {
      queueMicrotask(() => startTimer(record));
    }
  }

  const handleClick = (event: Event) => {
    if (event.defaultPrevented || !(event.target instanceof Element)) {
      return;
    }
    const toast = event.target.closest<HTMLElement>('[data-toast-id]');
    if (toast === null) {
      return;
    }
    const id = toast.dataset['toastId']!;
    const record = records.get(id);
    if (record === undefined) {
      return;
    }
    if (event.target.closest('[data-tr-toast-close]') !== null) {
      dismiss(id);
    } else if (event.target.closest('[data-tr-toast-action]') !== null) {
      record.options.action?.onAction?.(id);
      dispatch(root, id, 'action');
      dismiss(id);
    }
  };
  const handlePointerOver = (event: Event) => pauseToast(event.target as Element);
  const handlePointerOut = (event: Event) => resumeToast(event.target as Element);
  const handleFocusIn = (event: Event) => pauseToast(event.target as Element);
  const handleFocusOut = (event: Event) => resumeToast(event.target as Element);
  const handleWindowPause = () => {
    windowPaused = true;
    for (const record of records.values()) {
      stopTimer(record);
    }
  };
  const handleWindowResume = () => {
    windowPaused = false;
    for (const record of records.values()) {
      startTimer(record);
    }
  };
  const handleVisibility = () => {
    if (document.visibilityState === 'hidden') {
      handleWindowPause();
    } else {
      handleWindowResume();
    }
  };

  root.addEventListener('click', handleClick);
  root.addEventListener('pointerover', handlePointerOver);
  root.addEventListener('pointerout', handlePointerOut);
  root.addEventListener('focusin', handleFocusIn);
  root.addEventListener('focusout', handleFocusOut);
  document.defaultView?.addEventListener('blur', handleWindowPause);
  document.defaultView?.addEventListener('focus', handleWindowResume);
  document.addEventListener('visibilitychange', handleVisibility);

  return {
    destroy() {
      dismiss();
      root.removeEventListener('click', handleClick);
      root.removeEventListener('pointerover', handlePointerOver);
      root.removeEventListener('pointerout', handlePointerOut);
      root.removeEventListener('focusin', handleFocusIn);
      root.removeEventListener('focusout', handleFocusOut);
      document.defaultView?.removeEventListener('blur', handleWindowPause);
      document.defaultView?.removeEventListener('focus', handleWindowResume);
      document.removeEventListener('visibilitychange', handleVisibility);
      for (const viewport of createdViewports) {
        viewport.remove();
      }
    },
    dismiss,
    show,
    update,
  };
}

export type {
  ToastChangeDetail,
  ToastChangeReason,
  ToastPosition,
  ToastVariant,
} from './contract.js';
