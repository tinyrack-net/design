import '../../core/core.css';
import './pin-input.css';
import { expect, test, vi } from 'vitest';
import { pinInputChangeEventName, pinInputCompleteEventName } from './contract.js';
import { createPinInputManager } from './dom.js';

function createGroup(length = 4) {
  const group = document.createElement('fieldset');
  group.dataset['trPinInput'] = 'true';
  group.innerHTML = `${Array.from({ length }, (_, index) => `<input class="tr-pin-input-digit" data-index="${index}" data-tr-pin-input-digit="true" type="text">`).join('')}<input data-tr-pin-input-hidden="true" type="hidden">`;
  document.body.append(group);
  return group;
}

function key(target: Element, value: string) {
  target.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: value }),
  );
}

test('PinInput DOM manager covers methods, targets and complete events', () => {
  const group = createGroup();
  const digits = Array.from(
    group.querySelectorAll<HTMLInputElement>('[data-tr-pin-input-digit]'),
  );
  const hidden = group.querySelector<HTMLInputElement>('[data-tr-pin-input-hidden]')!;
  const changed = vi.fn();
  const completed = vi.fn();
  group.addEventListener(pinInputChangeEventName, changed);
  group.addEventListener(pinInputCompleteEventName, completed);
  const manager = createPinInputManager(document);

  manager.setValue('1a2345', digits[2]);
  expect(digits.map(({ value }) => value)).toEqual(['1', '2', '3', '4']);
  expect(hidden.value).toBe('1234');
  manager.focus(digits[2]);
  expect(document.activeElement).toBe(digits[0]);
  manager.clear(group);
  expect(changed).toHaveBeenLastCalledWith(
    expect.objectContaining({ detail: { complete: false, value: '' } }),
  );
  expect(document.activeElement).toBe(digits[0]);

  manager.setValue('1234', group);
  digits[3]?.dispatchEvent(new Event('input', { bubbles: true }));
  expect(completed).toHaveBeenCalledWith(
    expect.objectContaining({ detail: { complete: true, value: '1234' } }),
  );
  manager.destroy();
  group.remove();
});

test('PinInput DOM manager covers navigation, deletion, paste and event guards', () => {
  const group = createGroup();
  const digits = Array.from(
    group.querySelectorAll<HTMLInputElement>('[data-tr-pin-input-digit]'),
  );
  const manager = createPinInputManager(group);

  digits[0]!.value = 'a9';
  digits[0]!.dispatchEvent(new Event('input', { bubbles: true }));
  expect(digits[0]!.value).toBe('9');
  expect(document.activeElement).toBe(digits[1]);
  key(digits[1]!, 'ArrowRight');
  expect(document.activeElement).toBe(digits[2]);
  key(digits[2]!, 'ArrowLeft');
  expect(document.activeElement).toBe(digits[1]);
  key(digits[0]!, 'ArrowLeft');
  key(digits[3]!, 'ArrowRight');
  key(digits[0]!, 'Unrelated');
  digits[1]!.value = '2';
  key(digits[1]!, 'Backspace');
  expect(digits[1]!.value).toBe('');
  key(digits[1]!, 'Backspace');
  expect(digits[0]!.value).toBe('');
  key(digits[0]!, 'Backspace');
  digits[2]!.value = '3';
  key(digits[2]!, 'Delete');
  expect(digits[2]!.value).toBe('');

  const emptyPaste = new Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(emptyPaste, 'clipboardData', {
    value: { getData: () => 'abc' },
  });
  digits[0]!.dispatchEvent(emptyPaste);
  digits[0]!.dispatchEvent(new Event('paste', { bubbles: true }));
  const paste = new Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(paste, 'clipboardData', { value: { getData: () => '12-34' } });
  digits[0]!.dispatchEvent(paste);
  expect(digits.map(({ value }) => value)).toEqual(['1', '2', '3', '4']);
  expect(document.activeElement).toBe(digits[3]);

  const prevented = new Event('input', { bubbles: true, cancelable: true });
  prevented.preventDefault();
  digits[0]!.value = '88';
  digits[0]!.dispatchEvent(prevented);
  expect(digits[0]!.value).toBe('88');
  group.dispatchEvent(new Event('input', { bubbles: true }));
  group.dispatchEvent(new Event('paste', { bubbles: true }));
  group.dispatchEvent(new Event('keydown', { bubbles: true }));
  group.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, key: 'Backspace' }),
  );
  group.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
  manager.destroy();
  group.remove();
});

test('PinInput DOM manager scopes multiple groups and survives missing targets', () => {
  const host = document.createElement('div');
  document.body.append(host);
  const shadow = host.attachShadow({ mode: 'open' });
  const group = document.createElement('fieldset');
  group.dataset['trPinInput'] = 'true';
  group.innerHTML =
    '<input data-index="1" data-tr-pin-input-digit="true"><input data-tr-pin-input-digit="true">';
  shadow.append(group);
  const manager = createPinInputManager(shadow);
  manager.setValue('12');
  expect(
    Array.from(group.querySelectorAll<HTMLInputElement>('input')).map(
      ({ value }) => value,
    ),
  ).toEqual(['2', '1']);
  const first = group.querySelector<HTMLInputElement>('[data-tr-pin-input-digit]')!;
  first.value = '';
  first.dispatchEvent(new Event('input', { bubbles: true }));
  first.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
  const detached = document.createElement('div');
  manager.clear(detached);
  manager.focus(detached);
  manager.setValue('9', detached);
  const outside = document.createElement('input');
  outside.dataset['trPinInputDigit'] = 'true';
  shadow.append(outside);
  outside.dispatchEvent(new Event('input', { bubbles: true }));
  outside.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, key: 'Backspace' }),
  );
  outside.dispatchEvent(new Event('paste', { bubbles: true }));
  manager.destroy();
  host.remove();
});
