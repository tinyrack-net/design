import '../../core/core.css';
import '../form/form.css';
import '../overlay/overlay.css';
import './combobox.css';
import { expect, test, vi } from 'vitest';
import {
  comboboxInputChangeEventName,
  comboboxValueChangeEventName,
} from './contract.js';
import { createComboboxManager } from './dom.js';

function createCombobox(mode: 'select' | 'freeform' = 'select') {
  const root = document.createElement('div');
  root.dataset['trCombobox'] = 'true';
  root.dataset['mode'] = mode;
  root.innerHTML = `
    <input data-tr-combobox-input="true" role="combobox">
    <input data-tr-combobox-hidden="true" type="hidden">
    <div data-tr-combobox-content="true" data-tr-overlay="layer" popover="auto">
      <div role="listbox">
        <div role="option" data-value="a" data-text-value="Alpha"><strong>Alpha</strong></div>
        <div aria-disabled="true" role="option" data-value="b">Beta</div>
        <div disabled role="option" data-value="c">Charlie</div>
        <div id="delta" role="option" data-value="d">Delta</div>
      </div>
      <div data-tr-combobox-empty="true" hidden>No results</div>
    </div>`;
  document.body.append(root);
  return root;
}

function key(target: Element, value: string) {
  target.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: value }),
  );
}

test('Combobox DOM manager covers filtering, navigation and selection guards', () => {
  const root = createCombobox();
  const input = root.querySelector<HTMLInputElement>('[data-tr-combobox-input]')!;
  const hidden = root.querySelector<HTMLInputElement>('[data-tr-combobox-hidden]')!;
  const options = Array.from(root.querySelectorAll<HTMLElement>('[role="option"]'));
  const manager = createComboboxManager(root);
  const inputChanged = vi.fn();
  const valueChanged = vi.fn();
  root.addEventListener(comboboxInputChangeEventName, inputChanged);
  root.addEventListener(comboboxValueChangeEventName, valueChanged);

  expect(manager.select(options[1]!)).toBe(false);
  options[0]!.hidden = true;
  expect(manager.select(options[0]!)).toBe(false);
  options[0]!.hidden = false;
  input.value = 'zzz';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  expect(root.querySelector<HTMLElement>('[data-tr-combobox-empty]')?.hidden).toBe(
    false,
  );
  key(input, 'ArrowDown');
  key(input, 'Home');

  input.value = '';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  expect(input.getAttribute('aria-activedescendant')).toMatch(/^tr-combobox-option-/);
  key(input, 'Home');
  key(input, 'End');
  expect(input.getAttribute('aria-activedescendant')).toBe('delta');
  key(input, 'ArrowDown');
  key(input, 'ArrowUp');
  key(input, 'Enter');
  expect(hidden.value).toBe('d');
  expect(valueChanged).toHaveBeenLastCalledWith(
    expect.objectContaining({
      detail: expect.objectContaining({ reason: 'option', value: 'd' }),
    }),
  );
  expect(inputChanged).toHaveBeenCalled();
  manager.destroy();
  root.remove();
});

test('Combobox DOM manager covers click, blur auto-select and freeform reasons', async () => {
  const root = createCombobox('freeform');
  const input = root.querySelector<HTMLInputElement>('[data-tr-combobox-input]')!;
  const hidden = root.querySelector<HTMLInputElement>('[data-tr-combobox-hidden]')!;
  const manager = createComboboxManager(document);
  const changed = vi.fn();
  root.addEventListener(comboboxValueChangeEventName, changed);
  input.value = 'Custom';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  expect(hidden.value).toBe('Custom');
  key(input, 'Enter');
  key(input, 'Tab');
  expect(
    changed.mock.calls.map(([event]) => (event as CustomEvent).detail.reason),
  ).toContain('blur');

  root.dataset['mode'] = 'select';
  root.dataset['autoSelectOnBlur'] = 'true';
  input.value = 'alp';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  key(input, 'Tab');
  expect(hidden.value).toBe('a');
  input.removeAttribute('aria-activedescendant');
  key(input, 'Tab');
  for (const option of root.querySelectorAll<HTMLElement>('[role="option"]'))
    option.hidden = true;
  input.removeAttribute('aria-activedescendant');
  key(input, 'Tab');
  key(input, 'Unrelated');
  input.dispatchEvent(
    new FocusEvent('focusout', {
      bubbles: true,
      relatedTarget: root.querySelector('[role="option"]'),
    }),
  );
  await Promise.resolve();

  const nested = root.querySelector<HTMLElement>('[role="option"] strong')!;
  nested.click();
  expect(hidden.value).toBe('a');
  manager.destroy();
  root.remove();
});

test('Combobox DOM manager handles malformed and prevented events plus ShadowRoot', () => {
  const host = document.createElement('div');
  document.body.append(host);
  const shadow = host.attachShadow({ mode: 'open' });
  const root = createCombobox();
  shadow.append(root);
  const manager = createComboboxManager(root);
  const input = root.querySelector<HTMLInputElement>('[data-tr-combobox-input]')!;
  const prevented = new Event('input', { bubbles: true, cancelable: true });
  prevented.preventDefault();
  input.value = 'ignored';
  input.dispatchEvent(prevented);
  input.click();
  input.disabled = true;
  input.click();
  input.disabled = false;
  key(input, 'ArrowUp');
  input.removeAttribute('aria-activedescendant');
  key(input, 'ArrowDown');
  const preventedClick = new MouseEvent('click', { bubbles: true, cancelable: true });
  preventedClick.preventDefault();
  input.dispatchEvent(preventedClick);
  root.dispatchEvent(new Event('input', { bubbles: true }));
  root.dispatchEvent(new Event('click', { bubbles: true }));
  root.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
  root.dispatchEvent(new Event('focusout', { bubbles: true }));
  const detached = document.createElement('div');
  detached.setAttribute('role', 'option');
  expect(manager.select(detached)).toBe(false);
  const bareInput = document.createElement('input');
  bareInput.dataset['trComboboxInput'] = 'true';
  shadow.append(bareInput);
  const shadowManager = createComboboxManager(shadow);
  key(bareInput, 'Enter');
  bareInput.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
  const malformed = document.createElement('div');
  malformed.dataset['trCombobox'] = 'true';
  malformed.dataset['mode'] = 'freeform';
  const malformedInput = document.createElement('input');
  malformedInput.dataset['trComboboxInput'] = 'true';
  const option = document.createElement('div');
  option.setAttribute('role', 'option');
  option.textContent = 'Fallback value';
  malformed.append(malformedInput, option);
  shadow.append(malformed);
  const malformedManager = createComboboxManager(malformed);
  expect(manager.select(option)).toBe(true);
  expect(malformedInput.value).toBe('Fallback value');
  malformedInput.value = '';
  key(malformedInput, 'Tab');
  malformedInput.dispatchEvent(
    new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }),
  );
  const withoutInput = document.createElement('div');
  withoutInput.dataset['trCombobox'] = 'true';
  const withoutInputOption = document.createElement('div');
  withoutInputOption.setAttribute('role', 'option');
  withoutInput.append(withoutInputOption);
  shadow.append(withoutInput);
  expect(manager.select(withoutInputOption)).toBe(false);
  malformedManager.destroy();
  shadowManager.destroy();
  manager.destroy();
  host.remove();
});
