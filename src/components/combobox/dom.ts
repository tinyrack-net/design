import { createOverlayManager, type OverlayRoot } from '../overlay/dom.js';
import {
  type ComboboxInputChangeDetail,
  type ComboboxValueChangeDetail,
  type ComboboxValueChangeReason,
  comboboxInputChangeEventName,
  comboboxValueChangeEventName,
} from './contract.js';

export type ComboboxManagerRoot = Document | ShadowRoot | HTMLElement;

export type ComboboxManager = {
  destroy: () => void;
  select: (option: HTMLElement, reason?: ComboboxValueChangeReason) => boolean;
};

function overlayRootFor(root: ComboboxManagerRoot): OverlayRoot {
  if (root instanceof Document || root instanceof ShadowRoot) {
    return root;
  }
  const nodeRoot = root.getRootNode();
  return nodeRoot instanceof ShadowRoot ? nodeRoot : root.ownerDocument;
}

function comboboxRoot(element: Element) {
  return element.closest<HTMLElement>('[data-tr-combobox]');
}

function inputFor(root: HTMLElement) {
  return root.querySelector<HTMLInputElement>('[data-tr-combobox-input]');
}

function contentFor(root: HTMLElement) {
  return root.querySelector<HTMLElement>('[data-tr-combobox-content]');
}

function hiddenInputFor(root: HTMLElement) {
  return root.querySelector<HTMLInputElement>('[data-tr-combobox-hidden]');
}

function allOptions(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>('[role="option"]'));
}

function visibleOptions(root: HTMLElement) {
  return allOptions(root).filter(
    (option) =>
      !option.hidden &&
      option.getAttribute('aria-disabled') !== 'true' &&
      !option.hasAttribute('disabled'),
  );
}

function optionText(option: HTMLElement) {
  return option.dataset['textValue'] === undefined
    ? option.innerText.trim()
    : option.dataset['textValue'].trim();
}

function eventFor<T>(target: HTMLElement, name: string, detail: T, cancelable = false) {
  const ViewCustomEvent = target.ownerDocument.defaultView!.CustomEvent;
  return new ViewCustomEvent<T>(name, { bubbles: true, cancelable, detail });
}

function setActive(input: HTMLInputElement, option: HTMLElement | null) {
  const root = comboboxRoot(input)!;
  for (const candidate of allOptions(root)) {
    candidate.dataset['active'] = candidate === option ? 'true' : 'false';
  }
  if (option === null) {
    input.removeAttribute('aria-activedescendant');
  } else {
    if (option.id.length === 0) {
      option.id = `tr-combobox-option-${Math.random().toString(36).slice(2)}`;
    }
    input.setAttribute('aria-activedescendant', option.id);
  }
}

function activeOption(input: HTMLInputElement) {
  const id = input.getAttribute('aria-activedescendant');
  const root = comboboxRoot(input)!;
  return id === null ? null : root.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
}

function updateEmpty(root: HTMLElement, visibleCount: number) {
  const empty = root.querySelector<HTMLElement>('[data-tr-combobox-empty]');
  if (empty !== null) {
    empty.hidden = visibleCount !== 0;
  }
}

function filter(root: HTMLElement, query: string) {
  const normalized = query.trim().toLocaleLowerCase();
  let visibleCount = 0;
  for (const option of allOptions(root)) {
    const visible = optionText(option).toLocaleLowerCase().includes(normalized);
    option.hidden = !visible;
    if (visible) {
      visibleCount += 1;
    }
  }
  updateEmpty(root, visibleCount);
}

export function createComboboxManager(root: ComboboxManagerRoot): ComboboxManager {
  const overlay = createOverlayManager(overlayRootFor(root));

  function dispatchInput(input: HTMLInputElement) {
    input.dispatchEvent(
      eventFor<ComboboxInputChangeDetail>(input, comboboxInputChangeEventName, {
        inputValue: input.value,
      }),
    );
  }

  function dispatchValue(
    input: HTMLInputElement,
    value: string,
    option: HTMLElement | null,
    reason: ComboboxValueChangeReason,
  ) {
    input.dispatchEvent(
      eventFor<ComboboxValueChangeDetail>(input, comboboxValueChangeEventName, {
        inputValue: input.value,
        option,
        reason,
        value,
      }),
    );
  }

  function setFormValue(rootElement: HTMLElement, value: string) {
    const hidden = hiddenInputFor(rootElement);
    if (hidden === null || hidden.value === value) {
      return;
    }
    hidden.value = value;
    hidden.dispatchEvent(new Event('input', { bubbles: true }));
    hidden.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function select(option: HTMLElement, reason: ComboboxValueChangeReason = 'option') {
    const rootElement = comboboxRoot(option);
    if (
      rootElement === null ||
      option.hidden ||
      option.getAttribute('aria-disabled') === 'true'
    ) {
      return false;
    }
    const input = inputFor(rootElement);
    const content = contentFor(rootElement);
    if (input === null) {
      return false;
    }
    const value = option.dataset['value'] ?? optionText(option);
    input.value = optionText(option);
    setFormValue(rootElement, value);
    for (const candidate of allOptions(rootElement)) {
      candidate.setAttribute('aria-selected', String(candidate === option));
    }
    setActive(input, option);
    dispatchInput(input);
    dispatchValue(input, value, option, reason);
    if (content !== null) {
      overlay.close(content, { reason: 'programmatic' });
    }
    input.focus({ preventScroll: true });
    return true;
  }

  function open(input: HTMLInputElement) {
    const rootElement = comboboxRoot(input);
    const content = rootElement === null ? null : contentFor(rootElement);
    if (content !== null && !input.disabled) {
      overlay.open(content, { reason: 'trigger', source: input });
    }
  }

  function move(input: HTMLInputElement, offset: number) {
    const rootElement = comboboxRoot(input)!;
    const options = visibleOptions(rootElement);
    if (options.length === 0) {
      return;
    }
    const current = activeOption(input);
    const index = current === null ? (offset > 0 ? -1 : 0) : options.indexOf(current);
    setActive(input, options[(index + offset + options.length) % options.length]!);
  }

  function selectFreeform(input: HTMLInputElement, reason: ComboboxValueChangeReason) {
    const rootElement = comboboxRoot(input);
    if (rootElement === null || rootElement.dataset['mode'] !== 'freeform') {
      return;
    }
    setFormValue(rootElement, input.value);
    dispatchValue(input, input.value, null, reason);
  }

  const handleInput = (event: Event) => {
    if (event.defaultPrevented || !(event.target instanceof HTMLInputElement)) {
      return;
    }
    const input = event.target.closest<HTMLInputElement>('[data-tr-combobox-input]');
    const rootElement = input === null ? null : comboboxRoot(input);
    if (input === null || rootElement === null) {
      return;
    }
    filter(rootElement, input.value);
    setActive(input, visibleOptions(rootElement)[0] ?? null);
    dispatchInput(input);
    selectFreeform(input, 'input');
    open(input);
  };

  const handleClick = (event: Event) => {
    if (event.defaultPrevented || !(event.target instanceof Element)) {
      return;
    }
    const option = event.target.closest<HTMLElement>('[role="option"]');
    if (option !== null) {
      select(option);
      return;
    }
    const input = event.target.closest<HTMLInputElement>('[data-tr-combobox-input]');
    if (input !== null) {
      open(input);
    }
  };

  const handleKeyDown = (event: Event) => {
    if (
      !(event instanceof KeyboardEvent) ||
      !(event.target instanceof HTMLInputElement)
    ) {
      return;
    }
    const input = event.target.closest<HTMLInputElement>('[data-tr-combobox-input]');
    const rootElement = input === null ? null : comboboxRoot(input);
    if (input === null || rootElement === null) {
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open(input);
      move(input, event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      if (visibleOptions(rootElement).length === 0) {
        return;
      }
      event.preventDefault();
      const options = visibleOptions(rootElement);
      setActive(input, event.key === 'Home' ? options[0]! : options.at(-1)!);
    } else if (event.key === 'Enter') {
      const active = activeOption(input);
      if (active !== null) {
        event.preventDefault();
        select(active);
      } else {
        selectFreeform(input, 'input');
      }
    } else if (event.key === 'Tab') {
      const content = contentFor(rootElement);
      if (rootElement.dataset['autoSelectOnBlur'] === 'true') {
        const candidate = activeOption(input) ?? visibleOptions(rootElement)[0] ?? null;
        if (candidate !== null) {
          select(candidate, 'blur');
          return;
        }
      }
      selectFreeform(input, 'blur');
      if (content !== null) {
        overlay.close(content, { reason: 'programmatic' });
      }
    }
  };

  const handleFocusOut = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }
    const input = event.target.closest<HTMLInputElement>('[data-tr-combobox-input]');
    const rootElement = input === null ? null : comboboxRoot(input);
    if (input === null || rootElement === null) {
      return;
    }
    queueMicrotask(() => {
      const active = input.ownerDocument.activeElement;
      if (active instanceof Node && rootElement.contains(active)) {
        return;
      }
      if (rootElement.dataset['autoSelectOnBlur'] === 'true') {
        const candidate = activeOption(input) ?? visibleOptions(rootElement)[0] ?? null;
        if (candidate !== null) {
          select(candidate, 'blur');
          return;
        }
      }
      selectFreeform(input, 'blur');
      const content = contentFor(rootElement);
      if (content !== null) {
        overlay.close(content, { reason: 'programmatic' });
      }
    });
  };

  root.addEventListener('input', handleInput);
  root.addEventListener('click', handleClick);
  root.addEventListener('keydown', handleKeyDown);
  root.addEventListener('focusout', handleFocusOut);

  return {
    destroy() {
      root.removeEventListener('input', handleInput);
      root.removeEventListener('click', handleClick);
      root.removeEventListener('keydown', handleKeyDown);
      root.removeEventListener('focusout', handleFocusOut);
      overlay.destroy();
    },
    select,
  };
}

export type {
  ComboboxInputChangeDetail,
  ComboboxValueChangeDetail,
  ComboboxValueChangeReason,
} from './contract.js';
