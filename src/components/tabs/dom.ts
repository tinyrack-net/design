import {
  type TabsActivationMode,
  type TabsChangeDetail,
  type TabsOrientation,
  tabsChangeEventName,
  tabsContract,
} from './contract.js';

export type TabsManagerRoot = Document | ShadowRoot | HTMLElement;

export type TabsManager = {
  destroy: () => void;
  select: (value: string, target?: HTMLElement) => boolean;
  sync: (target?: HTMLElement) => void;
};

function tabsRoot(element: Element | null) {
  return element?.closest<HTMLElement>('[data-tr-tabs]') ?? null;
}

function resolveRoot(root: TabsManagerRoot, target?: HTMLElement) {
  if (target !== undefined) {
    return target.matches('[data-tr-tabs]') ? target : tabsRoot(target);
  }
  if (root instanceof HTMLElement && root.matches('[data-tr-tabs]')) {
    return root;
  }
  return root.querySelector<HTMLElement>('[data-tr-tabs]');
}

function roots(root: TabsManagerRoot) {
  const result = Array.from(root.querySelectorAll<HTMLElement>('[data-tr-tabs]'));
  if (root instanceof HTMLElement && root.matches('[data-tr-tabs]')) {
    result.unshift(root);
  }
  return result;
}

function triggers(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>('[role="tab"]'));
}

function enabledTriggers(root: HTMLElement) {
  return triggers(root).filter(
    (trigger) =>
      !trigger.hasAttribute('disabled') &&
      trigger.getAttribute('aria-disabled') !== 'true',
  );
}

function activationMode(root: HTMLElement): TabsActivationMode {
  return root.dataset['activationMode'] === 'manual'
    ? 'manual'
    : tabsContract.defaultActivationMode;
}

function orientation(root: HTMLElement): TabsOrientation {
  return root.dataset['orientation'] === 'vertical'
    ? 'vertical'
    : tabsContract.defaultOrientation;
}

function applyValue(root: HTMLElement, value: string) {
  root.dataset['value'] = value;
  for (const trigger of triggers(root)) {
    const selected = trigger.dataset['value'] === value;
    const disabled =
      trigger.hasAttribute('disabled') ||
      trigger.getAttribute('aria-disabled') === 'true';
    trigger.setAttribute('aria-selected', String(selected));
    trigger.dataset['active'] = selected ? 'true' : 'false';
    trigger.tabIndex = selected && !disabled ? 0 : -1;
  }
  for (const panel of root.querySelectorAll<HTMLElement>('[role="tabpanel"]')) {
    const selected = panel.dataset['value'] === value;
    panel.hidden = !selected;
    panel.dataset['active'] = selected ? 'true' : 'false';
  }
}

export function createTabsManager(root: TabsManagerRoot): TabsManager {
  const document = root instanceof Document ? root : root.ownerDocument;

  function sync(target?: HTMLElement) {
    const candidates = target === undefined ? roots(root) : [resolveRoot(root, target)];
    for (const candidate of candidates) {
      if (candidate === null) {
        continue;
      }
      const selected =
        candidate.dataset['value'] ??
        triggers(candidate).find(
          (trigger) => trigger.getAttribute('aria-selected') === 'true',
        )?.dataset['value'] ??
        enabledTriggers(candidate)[0]?.dataset['value'];
      if (selected !== undefined) {
        applyValue(candidate, selected);
      }
    }
  }

  function select(value: string, target?: HTMLElement) {
    const candidate = resolveRoot(root, target);
    const trigger = candidate?.querySelector<HTMLElement>(
      `[role="tab"][data-value="${CSS.escape(value)}"]`,
    );
    if (
      candidate === null ||
      candidate === undefined ||
      trigger === null ||
      trigger === undefined ||
      trigger.hasAttribute('disabled') ||
      trigger.getAttribute('aria-disabled') === 'true'
    ) {
      return false;
    }
    if (candidate.dataset['value'] === value) {
      return true;
    }
    applyValue(candidate, value);
    const ViewCustomEvent = document.defaultView!.CustomEvent;
    candidate.dispatchEvent(
      new ViewCustomEvent<TabsChangeDetail>(tabsChangeEventName, {
        bubbles: true,
        detail: { root: candidate, trigger, value },
      }),
    );
    return true;
  }

  function focusAt(candidate: HTMLElement, edge: 'first' | 'last') {
    const items = enabledTriggers(candidate);
    const next = edge === 'first' ? items[0] : items.at(-1);
    next?.focus();
    if (next !== undefined && activationMode(candidate) === 'automatic') {
      select(next.dataset['value'] ?? '', candidate);
    }
  }

  function focusOffset(candidate: HTMLElement, current: HTMLElement, offset: number) {
    const items = enabledTriggers(candidate);
    const index = items.indexOf(current);
    if (index === -1 || items.length === 0) {
      return;
    }
    const next = items[(index + offset + items.length) % items.length];
    next?.focus();
    if (next !== undefined && activationMode(candidate) === 'automatic') {
      select(next.dataset['value'] ?? '', candidate);
    }
  }

  const handleClick = (event: Event) => {
    if (event.defaultPrevented || !(event.target instanceof Element)) {
      return;
    }
    const trigger = event.target.closest<HTMLElement>('[role="tab"]');
    const candidate = trigger === null ? null : tabsRoot(trigger);
    if (trigger !== null && candidate !== null) {
      select(trigger.dataset['value'] ?? '', candidate);
    }
  };

  const handleKeyDown = (event: Event) => {
    if (!(event instanceof KeyboardEvent) || !(event.target instanceof Element)) {
      return;
    }
    const trigger = event.target.closest<HTMLElement>('[role="tab"]');
    const candidate = trigger === null ? null : tabsRoot(trigger);
    if (trigger === null || candidate === null) {
      return;
    }
    const currentOrientation = orientation(candidate);
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      focusAt(candidate, event.key === 'Home' ? 'first' : 'last');
      return;
    }
    if (
      currentOrientation === 'horizontal' &&
      (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
    ) {
      event.preventDefault();
      const rtl = document.defaultView?.getComputedStyle(candidate).direction === 'rtl';
      const forward = event.key === 'ArrowRight' ? 1 : -1;
      focusOffset(candidate, trigger, rtl ? -forward : forward);
      return;
    }
    if (
      currentOrientation === 'vertical' &&
      (event.key === 'ArrowUp' || event.key === 'ArrowDown')
    ) {
      event.preventDefault();
      focusOffset(candidate, trigger, event.key === 'ArrowDown' ? 1 : -1);
      return;
    }
    if (
      activationMode(candidate) === 'manual' &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault();
      select(trigger.dataset['value'] ?? '', candidate);
    }
  };

  root.addEventListener('click', handleClick);
  root.addEventListener('keydown', handleKeyDown);
  const Observer = document.defaultView?.MutationObserver;
  const observer =
    Observer === undefined
      ? null
      : new Observer((mutations) => {
          const changedRoots = new Set<HTMLElement>();
          for (const mutation of mutations) {
            const candidate = tabsRoot(mutation.target as Element);
            if (candidate !== null) {
              changedRoots.add(candidate);
            }
          }
          for (const candidate of changedRoots) {
            sync(candidate);
          }
        });
  observer?.observe(root instanceof Document ? document.documentElement : root, {
    childList: true,
    subtree: true,
  });
  queueMicrotask(() => sync());

  return {
    destroy() {
      root.removeEventListener('click', handleClick);
      root.removeEventListener('keydown', handleKeyDown);
      observer?.disconnect();
    },
    select,
    sync,
  };
}

export type { TabsChangeDetail } from './contract.js';
