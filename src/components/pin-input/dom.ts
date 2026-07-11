import {
  type PinInputChangeDetail,
  pinInputChangeEventName,
  pinInputCompleteEventName,
} from './contract.js';

export type PinInputManagerRoot = Document | ShadowRoot | HTMLElement;

export type PinInputManager = {
  clear: (target?: HTMLElement) => void;
  destroy: () => void;
  focus: (target?: HTMLElement) => void;
  setValue: (value: string, target?: HTMLElement) => void;
};

function groupFrom(element: Element | null) {
  return element?.closest<HTMLElement>('[data-tr-pin-input]') ?? null;
}

function resolveGroup(root: PinInputManagerRoot, target?: HTMLElement) {
  if (target !== undefined) {
    return target.matches('[data-tr-pin-input]') ? target : groupFrom(target);
  }
  if (root instanceof HTMLElement && root.matches('[data-tr-pin-input]')) {
    return root;
  }
  return root.querySelector<HTMLElement>('[data-tr-pin-input]');
}

function inputsFor(group: HTMLElement) {
  return Array.from(
    group.querySelectorAll<HTMLInputElement>('[data-tr-pin-input-digit]'),
  ).sort(
    (left, right) =>
      Number(left.dataset['index'] ?? 0) - Number(right.dataset['index'] ?? 0),
  );
}

function normalize(value: string, length: number) {
  return value.replace(/\D/g, '').slice(0, length);
}

function valueFor(group: HTMLElement) {
  return inputsFor(group)
    .map((input) => normalize(input.value, 1))
    .join('');
}

function updateHidden(group: HTMLElement, value: string) {
  const hidden = group.querySelector<HTMLInputElement>('[data-tr-pin-input-hidden]');
  if (hidden !== null) {
    hidden.value = value;
  }
}

function dispatch(group: HTMLElement) {
  const value = valueFor(group);
  const complete = value.length === inputsFor(group).length;
  updateHidden(group, value);
  const ViewCustomEvent = group.ownerDocument.defaultView!.CustomEvent;
  const detail: PinInputChangeDetail = { complete, value };
  group.dispatchEvent(
    new ViewCustomEvent<PinInputChangeDetail>(pinInputChangeEventName, {
      bubbles: true,
      detail,
    }),
  );
  if (complete) {
    group.dispatchEvent(
      new ViewCustomEvent<PinInputChangeDetail>(pinInputCompleteEventName, {
        bubbles: true,
        detail,
      }),
    );
  }
}

function setValue(group: HTMLElement, value: string) {
  const inputs = inputsFor(group);
  const normalized = normalize(value, inputs.length);
  for (const [index, input] of inputs.entries()) {
    input.value = normalized[index] ?? '';
  }
  updateHidden(group, normalized);
}

export function createPinInputManager(root: PinInputManagerRoot): PinInputManager {
  function focus(target?: HTMLElement) {
    resolveGroup(root, target)
      ?.querySelector<HTMLInputElement>('[data-tr-pin-input-digit]')
      ?.focus();
  }

  function clear(target?: HTMLElement) {
    const group = resolveGroup(root, target);
    if (group === null) {
      return;
    }
    setValue(group, '');
    dispatch(group);
    focus(group);
  }

  const handleInput = (event: Event) => {
    if (event.defaultPrevented || !(event.target instanceof HTMLInputElement)) {
      return;
    }
    const input = event.target.closest<HTMLInputElement>('[data-tr-pin-input-digit]');
    const group = input === null ? null : groupFrom(input);
    if (input === null || group === null) {
      return;
    }
    const inputs = inputsFor(group);
    const index = inputs.indexOf(input);
    input.value = normalize(input.value, 1).slice(-1);
    dispatch(group);
    if (input.value.length === 1) {
      inputs[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event: Event) => {
    if (
      !(event instanceof KeyboardEvent) ||
      !(event.target instanceof HTMLInputElement)
    ) {
      return;
    }
    const input = event.target.closest<HTMLInputElement>('[data-tr-pin-input-digit]');
    const group = input === null ? null : groupFrom(input);
    if (input === null || group === null) {
      return;
    }
    const inputs = inputsFor(group);
    const index = inputs.indexOf(input);

    if (event.key === 'Backspace') {
      event.preventDefault();
      if (input.value.length > 0) {
        input.value = '';
      } else if (index > 0) {
        const previous = inputs[index - 1]!;
        previous.value = '';
        previous.focus();
      }
      dispatch(group);
    } else if (event.key === 'Delete') {
      event.preventDefault();
      input.value = '';
      dispatch(group);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      inputs[index + (event.key === 'ArrowLeft' ? -1 : 1)]?.focus();
    }
  };

  const handlePaste = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }
    const input = event.target.closest<HTMLInputElement>('[data-tr-pin-input-digit]');
    const group = input === null ? null : groupFrom(input);
    const clipboard = (event as ClipboardEvent).clipboardData;
    if (input === null || group === null || clipboard == null) {
      return;
    }
    const inputs = inputsFor(group);
    const pasted = normalize(clipboard.getData('text'), inputs.length);
    if (pasted.length === 0) {
      return;
    }
    event.preventDefault();
    setValue(group, pasted);
    dispatch(group);
    const focusIndex = Math.min(pasted.length, inputs.length - 1);
    inputs[focusIndex]?.focus();
  };

  const handleFocus = (event: Event) => {
    if (
      event.target instanceof HTMLInputElement &&
      event.target.matches('[data-tr-pin-input-digit]')
    ) {
      event.target.select();
    }
  };

  root.addEventListener('input', handleInput);
  root.addEventListener('keydown', handleKeyDown);
  root.addEventListener('paste', handlePaste);
  root.addEventListener('focusin', handleFocus);

  return {
    clear,
    destroy() {
      root.removeEventListener('input', handleInput);
      root.removeEventListener('keydown', handleKeyDown);
      root.removeEventListener('paste', handlePaste);
      root.removeEventListener('focusin', handleFocus);
    },
    focus,
    setValue(value, target) {
      const group = resolveGroup(root, target);
      if (group !== null) {
        setValue(group, value);
      }
    },
  };
}

export type { PinInputChangeDetail } from './contract.js';
