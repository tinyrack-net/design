import '../../core/core.css';
import '../overlay/overlay.css';
import './menu.css';
import { expect, test, vi } from 'vitest';
import { menuSelectEventName } from './contract.js';
import { createMenuManager } from './dom.js';

function createMenu() {
  const root = document.createElement('div');
  root.dataset['trMenu'] = 'true';
  root.innerHTML = `
    <button aria-controls="menu-content" data-tr-menu-trigger="true">Actions</button>
    <div id="menu-content" data-tr-overlay="layer" popover="auto" role="menu">
      <button data-text-value="Alpha" data-value="a" role="menuitem" tabindex="-1">Alpha</button>
      <button aria-disabled="true" data-value="disabled" role="menuitem" tabindex="-1">Disabled</button>
      <button data-value="b" role="menuitem" tabindex="-1">Beta</button>
      <a href="#gamma" role="menuitem" tabindex="-1">Gamma</a>
    </div>`;
  document.body.append(root);
  return root;
}

function key(target: Element, value: string, modifiers: KeyboardEventInit = {}) {
  target.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: value,
      ...modifiers,
    }),
  );
}

test.each([
  ['ArrowDown', 'Alpha'],
  ['Home', 'Alpha'],
  ['ArrowUp', 'Gamma'],
  ['End', 'Gamma'],
] as const)('Menu DOM trigger %s focuses %s', async (pressed, expected) => {
  const root = createMenu();
  const manager = createMenuManager(root);
  key(root.querySelector('[data-tr-menu-trigger]')!, pressed);
  await Promise.resolve();
  expect(document.activeElement?.textContent).toBe(expected);
  manager.destroy();
  root.remove();
});

test('Menu DOM manager covers roving focus, typeahead, modifiers and Tab close', async () => {
  const root = createMenu();
  const manager = createMenuManager(document);
  const items = Array.from(root.querySelectorAll<HTMLElement>('[role="menuitem"]'));
  key(root.querySelector('[data-tr-menu-trigger]')!, 'ArrowDown');
  await Promise.resolve();
  key(items[0]!, 'ArrowDown');
  expect(document.activeElement).toBe(items[2]);
  key(items[2]!, 'ArrowUp');
  expect(document.activeElement).toBe(items[0]);
  key(items[0]!, 'End');
  expect(document.activeElement).toBe(items[3]);
  key(items[3]!, 'Home');
  expect(document.activeElement).toBe(items[0]);
  key(items[0]!, 'b');
  expect(document.activeElement).toBe(items[2]);
  key(items[2]!, 'e');
  key(items[2]!, 'x', { ctrlKey: true });
  key(items[2]!, 'Tab');
  manager.destroy();
  root.remove();
});

test('Menu DOM manager respects canceled and disabled selections and malformed targets', () => {
  const root = createMenu();
  const manager = createMenuManager(root);
  const selected = vi.fn((event: Event) => event.preventDefault());
  root.addEventListener(menuSelectEventName, selected);
  const items = root.querySelectorAll<HTMLElement>('[role="menuitem"]');
  items[0]!.click();
  expect(selected).toHaveBeenCalledWith(
    expect.objectContaining({ detail: expect.objectContaining({ value: 'a' }) }),
  );
  items[1]!.setAttribute('disabled', '');
  items[1]!.click();
  expect(selected).toHaveBeenCalledTimes(1);
  root.removeEventListener(menuSelectEventName, selected);
  items[3]!.click();
  root.dispatchEvent(new Event('click', { bubbles: true }));
  root.dispatchEvent(new Event('keydown', { bubbles: true }));
  const orphan = document.createElement('button');
  orphan.dataset['trMenuTrigger'] = 'true';
  key(orphan, 'ArrowDown');
  const prevented = new MouseEvent('click', { bubbles: true, cancelable: true });
  prevented.preventDefault();
  items[0]!.dispatchEvent(prevented);
  manager.destroy();
  root.remove();
});

test('Menu DOM manager resolves popovertargets inside ShadowRoot and ignores orphans', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const shadow = host.attachShadow({ mode: 'open' });
  const root = createMenu();
  shadow.append(root);
  const trigger = root.querySelector<HTMLElement>('[data-tr-menu-trigger]')!;
  trigger.removeAttribute('aria-controls');
  trigger.setAttribute('popovertarget', 'menu-content');
  const manager = createMenuManager(root);
  key(trigger, 'ArrowUp');
  await Promise.resolve();
  expect(shadow.activeElement?.textContent).toBe('Gamma');

  const missingTrigger = document.createElement('button');
  missingTrigger.dataset['trMenuTrigger'] = 'true';
  root.append(missingTrigger);
  key(missingTrigger, 'ArrowDown');
  const orphan = document.createElement('button');
  orphan.setAttribute('role', 'menuitem');
  root.append(orphan);
  key(orphan, 'ArrowDown');
  orphan.click();

  const emptyContent = document.createElement('div');
  emptyContent.id = 'empty-menu';
  emptyContent.setAttribute('popover', 'auto');
  emptyContent.setAttribute('role', 'menu');
  root.append(emptyContent);
  missingTrigger.setAttribute('aria-controls', 'empty-menu');
  key(missingTrigger, 'Home');
  await Promise.resolve();
  manager.destroy();
  host.remove();
});
