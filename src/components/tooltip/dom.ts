import { popoverChangeEventName } from '../popover/contract.js';
import { createPopoverManager, type PopoverRoot } from '../popover/dom.js';
import {
  type TooltipOpenChangeDetail,
  tooltipContract,
  tooltipOpenChangeEventName,
} from './contract.js';

export type TooltipManagerRoot = Document | ShadowRoot | HTMLElement;

export type TooltipManager = {
  close: (trigger: HTMLElement) => void;
  destroy: () => void;
  open: (trigger: HTMLElement) => void;
};

function popoverRootFor(root: TooltipManagerRoot): PopoverRoot {
  if (root instanceof Document || root instanceof ShadowRoot) {
    return root;
  }

  const nodeRoot = root.getRootNode();
  return nodeRoot instanceof ShadowRoot ? nodeRoot : root.ownerDocument;
}

function tooltipRoot(trigger: Element) {
  return trigger.closest<HTMLElement>('[data-tr-tooltip]');
}

function delayFrom(trigger: HTMLElement, name: 'openDelay' | 'closeDelay') {
  const root = tooltipRoot(trigger);
  const value = Number(root?.dataset[name]);
  const fallback =
    name === 'openDelay'
      ? tooltipContract.defaultOpenDelay
      : tooltipContract.defaultCloseDelay;

  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function contentFor(trigger: HTMLElement, scope: TooltipManagerRoot) {
  const id = trigger.getAttribute('aria-describedby');
  if (id === null) {
    return null;
  }

  return scope.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
}

function dispatchChange(trigger: HTMLElement, content: HTMLElement, open: boolean) {
  const ViewCustomEvent = trigger.ownerDocument.defaultView!.CustomEvent;
  trigger.dispatchEvent(
    new ViewCustomEvent<TooltipOpenChangeDetail>(tooltipOpenChangeEventName, {
      bubbles: true,
      detail: { content, open, trigger },
    }),
  );
}

export function createTooltipManager(root: TooltipManagerRoot): TooltipManager {
  const popover = createPopoverManager(popoverRootFor(root));
  const timers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();
  let activeTrigger: HTMLElement | null = null;

  function clearTimer(trigger: HTMLElement) {
    const timer = timers.get(trigger);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.delete(trigger);
    }
  }

  function setState(trigger: HTMLElement, open: boolean) {
    const content = contentFor(trigger, root);
    if (content === null) {
      return;
    }

    trigger.dataset['state'] = open ? 'open' : 'closed';
    content.dataset['state'] = open ? 'open' : 'closed';
    dispatchChange(trigger, content, open);
  }

  function open(trigger: HTMLElement) {
    clearTimer(trigger);
    const content = contentFor(trigger, root);
    if (content === null || trigger.getAttribute('aria-disabled') === 'true') {
      return;
    }

    if (activeTrigger !== null && activeTrigger !== trigger) {
      close(activeTrigger);
    }

    activeTrigger = trigger;
    popover.open(content, { reason: 'trigger', source: trigger });
  }

  function close(trigger: HTMLElement) {
    clearTimer(trigger);
    const content = contentFor(trigger, root);
    if (content === null) {
      return;
    }

    popover.close(content, { reason: 'programmatic' });
    if (activeTrigger === trigger) {
      activeTrigger = null;
    }
  }

  function schedule(trigger: HTMLElement, intent: 'open' | 'close') {
    clearTimer(trigger);
    timers.set(
      trigger,
      setTimeout(
        () => {
          timers.delete(trigger);
          if (intent === 'open') {
            open(trigger);
          } else {
            close(trigger);
          }
        },
        delayFrom(trigger, intent === 'open' ? 'openDelay' : 'closeDelay'),
      ),
    );
  }

  function triggerFrom(event: Event) {
    return event.target instanceof Element
      ? event.target.closest<HTMLElement>('[data-tr-tooltip-trigger]')
      : null;
  }

  const handlePointerOver = (event: Event) => {
    const trigger = triggerFrom(event);
    if (trigger !== null) {
      schedule(trigger, 'open');
    }
  };

  const handlePointerOut = (event: Event) => {
    const trigger = triggerFrom(event);
    const related = (event as PointerEvent).relatedTarget;
    if (trigger !== null && !(related instanceof Node && trigger.contains(related))) {
      schedule(trigger, 'close');
    }
  };

  const handleFocusIn = (event: Event) => {
    const trigger = triggerFrom(event);
    if (trigger !== null) {
      schedule(trigger, 'open');
    }
  };

  const handleFocusOut = (event: Event) => {
    const trigger = triggerFrom(event);
    if (trigger !== null) {
      schedule(trigger, 'close');
    }
  };

  const handleOverlayChange = (event: Event) => {
    const detail = (event as CustomEvent<{ open?: boolean; source?: HTMLElement }>)
      .detail;
    if (detail?.source?.matches('[data-tr-tooltip-trigger]')) {
      setState(detail.source, detail.open === true);
      if (detail.open !== true && activeTrigger === detail.source) {
        activeTrigger = null;
      }
    }
  };

  root.addEventListener('pointerover', handlePointerOver);
  root.addEventListener('pointerout', handlePointerOut);
  root.addEventListener('focusin', handleFocusIn);
  root.addEventListener('focusout', handleFocusOut);
  root.addEventListener(popoverChangeEventName, handleOverlayChange);

  return {
    close,
    destroy() {
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }
      timers.clear();
      root.removeEventListener('pointerover', handlePointerOver);
      root.removeEventListener('pointerout', handlePointerOut);
      root.removeEventListener('focusin', handleFocusIn);
      root.removeEventListener('focusout', handleFocusOut);
      root.removeEventListener(popoverChangeEventName, handleOverlayChange);
      popover.destroy();
    },
    open,
  };
}

export type { TooltipOpenChangeDetail } from './contract.js';
