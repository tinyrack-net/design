import '../../core/core.css';
import '../form/form.css';
import '../popover/popover.css';
import './combobox.css';
import { afterEach, expect, test, vi } from 'vitest';
import {
  comboboxInputChangeEventName,
  comboboxValueChangeEventName,
} from './contract.js';
import { createComboboxManager } from './dom.js';

afterEach(() => document.body.replaceChildren());

test('Combobox filters, selects custom options and writes a hidden form value', () => {
  const root = document.createElement('div');
  root.dataset['trCombobox'] = 'true';
  root.dataset['mode'] = 'select';
  root.innerHTML = `
    <input class="tr-input" data-tr-combobox-input role="combobox" aria-controls="fruit-list">
    <input data-tr-combobox-hidden name="fruit" type="hidden">
    <div class="tr-layer tr-combobox-content" data-tr-combobox-content data-tr-overlay="layer" popover="auto">
      <div id="fruit-list" role="listbox">
        <div id="apple" role="option" data-value="a" data-text-value="Apple"><strong>Apple</strong></div>
        <div id="banana" role="option" data-value="b">Banana</div>
      </div>
      <div data-tr-combobox-empty hidden>No fruit</div>
    </div>`;
  document.body.append(root);
  const manager = createComboboxManager(root);
  const input = root.querySelector<HTMLInputElement>('[data-tr-combobox-input]')!;
  const hidden = root.querySelector<HTMLInputElement>('[data-tr-combobox-hidden]')!;
  const banana = root.querySelector<HTMLElement>('#banana')!;
  const changed = vi.fn();
  root.addEventListener(comboboxValueChangeEventName, changed);

  input.value = 'app';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  expect(banana.hidden).toBe(true);
  expect(input.getAttribute('aria-activedescendant')).toBe('apple');

  input.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter' }),
  );
  expect(input.value).toBe('Apple');
  expect(hidden.value).toBe('a');
  expect(changed).toHaveBeenCalledOnce();
  manager.destroy();
});

test('Combobox freeform mode synchronizes input and value events', () => {
  const root = document.createElement('div');
  root.dataset['trCombobox'] = 'true';
  root.dataset['mode'] = 'freeform';
  root.innerHTML = `
    <input data-tr-combobox-input role="combobox">
    <input data-tr-combobox-hidden type="hidden">
    <div data-tr-combobox-content data-tr-overlay="layer" popover="auto"><div role="listbox"></div></div>`;
  document.body.append(root);
  const manager = createComboboxManager(root);
  const input = root.querySelector<HTMLInputElement>('[data-tr-combobox-input]')!;
  const hidden = root.querySelector<HTMLInputElement>('[data-tr-combobox-hidden]')!;
  const inputChanged = vi.fn();
  const valueChanged = vi.fn();
  root.addEventListener(comboboxInputChangeEventName, inputChanged);
  root.addEventListener(comboboxValueChangeEventName, valueChanged);

  input.value = 'Klingon';
  input.dispatchEvent(new Event('input', { bubbles: true }));

  expect(hidden.value).toBe('Klingon');
  expect(inputChanged).toHaveBeenCalledOnce();
  expect(valueChanged).toHaveBeenCalledOnce();
  manager.destroy();
});
