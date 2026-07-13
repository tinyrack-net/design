import { createPopoverManager, type PopoverRoot } from '../popover/dom.js';
import { type MenuSelectDetail, menuSelectEventName } from './contract.js';

export type MenuManagerRoot = Document | ShadowRoot | HTMLElement;

export type MenuManager = {
  destroy: () => void;
};

function popoverRootFor(root: MenuManagerRoot): PopoverRoot {
  if (root instanceof Document || root instanceof ShadowRoot) {
    return root;
  }
  const nodeRoot = root.getRootNode();
  return nodeRoot instanceof ShadowRoot ? nodeRoot : root.ownerDocument;
}

function enabledItems(content: HTMLElement) {
  return Array.from(content.querySelectorAll<HTMLElement>('[role="menuitem"]')).filter(
    (item) =>
      !item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true',
  );
}

function contentForTrigger(trigger: HTMLElement, scope: MenuManagerRoot) {
  const id =
    trigger.getAttribute('aria-controls') ?? trigger.getAttribute('popovertarget');
  return id === null ? null : scope.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
}

function contentForItem(item: Element) {
  return item.closest<HTMLElement>('[role="menu"]');
}

function focusAt(content: HTMLElement, edge: 'first' | 'last') {
  const items = enabledItems(content);
  (edge === 'first' ? items[0] : items.at(-1))?.focus();
}

export function createMenuManager(root: MenuManagerRoot): MenuManager {
  const popover = createPopoverManager(popoverRootFor(root));
  let search = '';
  let searchTimer: ReturnType<typeof setTimeout> | null = null;

  function resetSearchSoon() {
    if (searchTimer !== null) {
      clearTimeout(searchTimer);
    }
    searchTimer = setTimeout(() => {
      search = '';
      searchTimer = null;
    }, 500);
  }

  function focusByOffset(content: HTMLElement, current: HTMLElement, offset: number) {
    const items = enabledItems(content);
    const index = items.indexOf(current);
    const next = items[(Math.max(index, 0) + offset + items.length) % items.length];
    next?.focus();
  }

  function handleTypeahead(content: HTMLElement, key: string) {
    search += key.toLocaleLowerCase();
    resetSearchSoon();
    const items = enabledItems(content);
    const active = content.ownerDocument.activeElement;
    const start = Math.max(items.indexOf(active as HTMLElement), -1) + 1;
    const ordered = [...items.slice(start), ...items.slice(0, start)];
    ordered
      .find((item) =>
        (item.dataset['textValue'] ?? item.textContent ?? '')
          .trim()
          .toLocaleLowerCase()
          .startsWith(search),
      )
      ?.focus();
  }

  const handleKeyDown = (event: Event) => {
    if (!(event instanceof KeyboardEvent) || !(event.target instanceof Element)) {
      return;
    }

    const trigger = event.target.closest<HTMLElement>('[data-tr-menu-trigger]');
    if (
      trigger !== null &&
      ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)
    ) {
      const content = contentForTrigger(trigger, root);
      if (content === null) {
        return;
      }
      event.preventDefault();
      popover.open(content, { reason: 'trigger', source: trigger });
      queueMicrotask(() =>
        focusAt(
          content,
          event.key === 'ArrowUp' || event.key === 'End' ? 'last' : 'first',
        ),
      );
      return;
    }

    const item = event.target.closest<HTMLElement>('[role="menuitem"]');
    const content = item === null ? null : contentForItem(item);
    if (item === null || content === null) {
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      focusByOffset(content, item, event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      focusAt(content, event.key === 'Home' ? 'first' : 'last');
    } else if (event.key === 'Tab') {
      popover.close(content, { reason: 'programmatic' });
    } else if (
      event.key.length === 1 &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      handleTypeahead(content, event.key);
    }
  };

  const handleClick = (event: Event) => {
    if (event.defaultPrevented || !(event.target instanceof Element)) {
      return;
    }
    const item = event.target.closest<HTMLElement>('[role="menuitem"]');
    if (
      item === null ||
      item.hasAttribute('disabled') ||
      item.getAttribute('aria-disabled') === 'true'
    ) {
      return;
    }
    const content = contentForItem(item);
    if (content === null) {
      return;
    }
    const ViewCustomEvent = item.ownerDocument.defaultView?.CustomEvent ?? CustomEvent;
    const allowed = item.dispatchEvent(
      new ViewCustomEvent<MenuSelectDetail>(menuSelectEventName, {
        bubbles: true,
        cancelable: true,
        detail: { item, value: item.dataset['value'] ?? null },
      }),
    );
    if (allowed) {
      popover.close(content, { reason: 'programmatic' });
    }
  };

  root.addEventListener('keydown', handleKeyDown);
  root.addEventListener('click', handleClick);

  return {
    destroy() {
      root.removeEventListener('keydown', handleKeyDown);
      root.removeEventListener('click', handleClick);
      if (searchTimer !== null) {
        clearTimeout(searchTimer);
      }
      popover.destroy();
    },
  };
}

export type { MenuSelectDetail } from './contract.js';
