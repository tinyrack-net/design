import {
  type AccordionChangeDetail,
  type AccordionType,
  type AccordionValue,
  accordionChangeEventName,
  accordionContract,
} from './contract.js';

export type AccordionManagerRoot = Document | ShadowRoot | HTMLElement;

export type AccordionManager = {
  destroy: () => void;
  setValue: (value: AccordionValue, target?: HTMLElement) => boolean;
  sync: (target?: HTMLElement) => void;
};

const dataCollapsibleKey = 'collapsible';
const dataControlledKey = 'controlled';
const dataTypeKey = 'type';
const dataValueKey = 'value';
const dataValuesKey = 'values';

function accordionRoot(element: Element | null) {
  return element?.closest<HTMLElement>('[data-tr-accordion]') ?? null;
}

function resolveRoot(root: AccordionManagerRoot, target?: HTMLElement) {
  if (target !== undefined) {
    return target.matches('[data-tr-accordion]') ? target : accordionRoot(target);
  }
  if (root instanceof HTMLElement && root.matches('[data-tr-accordion]')) {
    return root;
  }
  return root.querySelector<HTMLElement>('[data-tr-accordion]');
}

function roots(root: AccordionManagerRoot) {
  const result = Array.from(root.querySelectorAll<HTMLElement>('[data-tr-accordion]'));
  if (root instanceof HTMLElement && root.matches('[data-tr-accordion]')) {
    result.unshift(root);
  }
  return result;
}

function typeFor(root: HTMLElement): AccordionType {
  return root.dataset[dataTypeKey] === 'multiple'
    ? 'multiple'
    : accordionContract.defaultType;
}

function isCollapsible(root: HTMLElement) {
  return root.dataset[dataCollapsibleKey] !== 'false';
}

function items(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLDetailsElement>(
      'details[data-tr-accordion-item][data-value]',
    ),
  ).filter((item) => accordionRoot(item) === root);
}

function summaryFor(item: HTMLDetailsElement) {
  return Array.from(item.children).find(
    (child): child is HTMLElement =>
      child instanceof HTMLElement &&
      child.tagName === 'SUMMARY' &&
      child.hasAttribute('data-tr-accordion-summary'),
  );
}

function summaries(root: HTMLElement) {
  return items(root)
    .map(summaryFor)
    .filter((summary): summary is HTMLElement => summary !== undefined);
}

function itemValue(item: HTMLDetailsElement) {
  return item.dataset[dataValueKey] as string;
}

function currentValue(root: HTMLElement): AccordionValue {
  const openValues = items(root)
    .filter((item) => item.open)
    .map(itemValue);
  return typeFor(root) === 'multiple' ? openValues : (openValues[0] ?? null);
}

function equalValues(left: AccordionValue, right: AccordionValue) {
  if (Array.isArray(left) && Array.isArray(right)) {
    return (
      left.length === right.length &&
      left.every((value, index) => value === right[index])
    );
  }
  return left === right;
}

function normalizeValue(root: HTMLElement, value: AccordionValue) {
  const type = typeFor(root);
  if (type === 'multiple') {
    return Array.isArray(value) ? value : [];
  }
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function applyValue(root: HTMLElement, value: AccordionValue) {
  let normalized = normalizeValue(root, value);
  if (normalized === null && typeFor(root) === 'single' && !isCollapsible(root)) {
    const existing = currentValue(root);
    normalized =
      typeof existing === 'string'
        ? existing
        : (items(root)[0]?.dataset[dataValueKey] ?? null);
  }
  const selected = new Set(Array.isArray(normalized) ? normalized : [normalized]);
  for (const item of items(root)) {
    item.open = selected.has(itemValue(item));
  }
  return normalized;
}

function serializedControlledValue(root: HTMLElement): AccordionValue {
  if (typeFor(root) === 'single') {
    return root.dataset[dataValueKey] || null;
  }
  try {
    const parsed = JSON.parse(root.dataset[dataValuesKey] ?? '[]');
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === 'string')
      : [];
  } catch {
    return [];
  }
}

function serializeValue(root: HTMLElement, value: AccordionValue) {
  if (typeFor(root) === 'single') {
    root.dataset[dataValueKey] = typeof value === 'string' ? value : '';
    delete root.dataset[dataValuesKey];
    return;
  }
  root.dataset[dataValuesKey] = JSON.stringify(value as string[]);
  delete root.dataset[dataValueKey];
}

function sourceItemFor(target: EventTarget | null) {
  if (!(target instanceof HTMLDetailsElement)) {
    return null;
  }
  return target.hasAttribute('data-tr-accordion-item') ? target : null;
}

export function createAccordionManager(root: AccordionManagerRoot): AccordionManager {
  const document = root instanceof Document ? root : root.ownerDocument;
  const snapshots = new WeakMap<HTMLElement, AccordionValue>();
  const pending = new Map<HTMLElement, HTMLDetailsElement | null>();
  let destroyed = false;

  function normalize(
    candidate: HTMLElement,
    previous: AccordionValue,
    source: HTMLDetailsElement | null,
  ) {
    if (typeFor(candidate) === 'multiple') {
      return currentValue(candidate);
    }

    const openItems = items(candidate).filter((item) => item.open);
    if (openItems.length > 1) {
      const newlyOpened =
        typeof previous === 'string'
          ? openItems.find((item) => itemValue(item) !== previous)
          : undefined;
      const keep =
        newlyOpened ??
        (source?.open && itemValue(source) !== previous ? source : openItems[0]);
      for (const item of openItems) {
        item.open = item === keep;
      }
    } else if (openItems.length === 0 && !isCollapsible(candidate)) {
      const previousItem =
        typeof previous === 'string'
          ? items(candidate).find((item) => itemValue(item) === previous)
          : undefined;
      (previousItem ?? items(candidate)[0])?.setAttribute('open', '');
    }
    return currentValue(candidate);
  }

  function dispatchChange(
    candidate: HTMLElement,
    item: HTMLDetailsElement | null,
    value: AccordionValue,
  ) {
    const ViewCustomEvent = document.defaultView?.CustomEvent ?? CustomEvent;
    candidate.dispatchEvent(
      new ViewCustomEvent<AccordionChangeDetail>(accordionChangeEventName, {
        bubbles: true,
        detail: { item, root: candidate, type: typeFor(candidate), value },
      }),
    );
  }

  function schedule(candidate: HTMLElement, source: HTMLDetailsElement | null) {
    const existing = pending.get(candidate);
    pending.set(candidate, source?.open ? source : (existing ?? source));
    if (existing !== undefined) {
      return;
    }
    queueMicrotask(() => {
      if (destroyed) {
        return;
      }
      const pendingSource = pending.get(candidate) ?? null;
      pending.delete(candidate);
      const previous = snapshots.get(candidate) ?? currentValue(candidate);
      const next = normalize(candidate, previous, pendingSource);
      const controlledValue = serializedControlledValue(candidate);
      const controlledSync =
        candidate.dataset[dataControlledKey] === 'true' &&
        equalValues(next, controlledValue);

      snapshots.set(candidate, next);
      if (candidate.dataset[dataControlledKey] !== 'true') {
        serializeValue(candidate, next);
      }
      if (!equalValues(previous, next) && !controlledSync) {
        dispatchChange(candidate, pendingSource, next);
      }

      if (candidate.dataset[dataControlledKey] === 'true') {
        queueMicrotask(() => {
          if (destroyed || !candidate.isConnected) {
            return;
          }
          const expected = serializedControlledValue(candidate);
          if (!equalValues(currentValue(candidate), expected)) {
            snapshots.set(candidate, applyValue(candidate, expected));
          }
        });
      }
    });
  }

  function sync(target?: HTMLElement) {
    const candidates = target === undefined ? roots(root) : [resolveRoot(root, target)];
    for (const candidate of candidates) {
      if (candidate === null) {
        continue;
      }
      const previous = snapshots.get(candidate) ?? currentValue(candidate);
      const next = normalize(candidate, previous, null);
      snapshots.set(candidate, next);
      if (candidate.dataset[dataControlledKey] !== 'true') {
        serializeValue(candidate, next);
      }
    }
  }

  function setValue(value: AccordionValue, target?: HTMLElement) {
    const candidate = resolveRoot(root, target);
    if (candidate === null) {
      return false;
    }
    const previous = snapshots.get(candidate) ?? currentValue(candidate);
    const next = applyValue(candidate, value);
    snapshots.set(candidate, next);
    serializeValue(candidate, next);
    if (!equalValues(previous, next)) {
      dispatchChange(candidate, null, next);
    }
    return true;
  }

  const handleToggle = (event: Event) => {
    const item = sourceItemFor(event.target);
    const candidate = item === null ? null : accordionRoot(item);
    if (item !== null && candidate !== null) {
      schedule(candidate, item);
    }
  };

  const handleClick = (event: Event) => {
    if (event.defaultPrevented || !(event.target instanceof Element)) {
      return;
    }
    const summary = event.target.closest<HTMLElement>(
      'summary[data-tr-accordion-summary]',
    );
    const item = summary?.parentElement;
    const candidate = summary === null ? null : accordionRoot(summary);
    if (
      item instanceof HTMLDetailsElement &&
      item.hasAttribute('data-tr-accordion-item') &&
      candidate !== null &&
      typeFor(candidate) === 'single' &&
      !isCollapsible(candidate) &&
      item.open
    ) {
      event.preventDefault();
    }
  };

  const handleKeyDown = (event: Event) => {
    if (
      !(event instanceof KeyboardEvent) ||
      !(event.target instanceof Element) ||
      !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)
    ) {
      return;
    }
    const summary = event.target.closest<HTMLElement>(
      'summary[data-tr-accordion-summary]',
    );
    const candidate = summary === null ? null : accordionRoot(summary);
    if (summary === null || candidate === null) {
      return;
    }
    const group = summaries(candidate);
    const index = group.indexOf(summary);
    if (index === -1 || group.length === 0) {
      return;
    }
    event.preventDefault();
    if (event.key === 'Home' || event.key === 'End') {
      group[event.key === 'Home' ? 0 : group.length - 1]?.focus();
      return;
    }
    const offset = event.key === 'ArrowDown' ? 1 : -1;
    group[(index + offset + group.length) % group.length]?.focus();
  };

  root.addEventListener('click', handleClick);
  root.addEventListener('toggle', handleToggle, true);
  root.addEventListener('keydown', handleKeyDown);

  const Observer = document.defaultView?.MutationObserver;
  const observer =
    Observer === undefined
      ? null
      : new Observer((mutations) => {
          const changedRoots = new Set<HTMLElement>();
          for (const mutation of mutations) {
            if (mutation.type !== 'childList') {
              continue;
            }
            const candidate = accordionRoot(mutation.target as Element);
            if (candidate !== null) {
              changedRoots.add(candidate);
            }
            for (const addedNode of mutation.addedNodes) {
              if (!(addedNode instanceof Element)) {
                continue;
              }
              if (addedNode.matches('[data-tr-accordion]')) {
                changedRoots.add(addedNode as HTMLElement);
              }
              for (const discovered of addedNode.querySelectorAll<HTMLElement>(
                '[data-tr-accordion]',
              )) {
                changedRoots.add(discovered);
              }
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

  sync();

  return {
    destroy() {
      destroyed = true;
      pending.clear();
      root.removeEventListener('click', handleClick);
      root.removeEventListener('toggle', handleToggle, true);
      root.removeEventListener('keydown', handleKeyDown);
      observer?.disconnect();
    },
    setValue,
    sync,
  };
}

export type {
  AccordionChangeDetail,
  AccordionType,
  AccordionValue,
} from './contract.js';
