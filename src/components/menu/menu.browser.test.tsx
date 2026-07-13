import '../../core/core.css';
import '../popover/popover.css';
import './menu.css';
import { afterEach, expect, test, vi } from 'vitest';
import { menuSelectEventName } from './contract.js';
import { createMenuManager } from './dom.js';

afterEach(() => document.body.replaceChildren());

test('Menu supports trigger keys, roving focus, typeahead and selection close', async () => {
  const root = document.createElement('div');
  root.dataset['trMenu'] = 'true';
  root.innerHTML = `
    <button data-tr-menu-trigger popovertarget="rack-menu" aria-controls="rack-menu">Actions</button>
    <div id="rack-menu" class="tr-layer tr-menu-content" data-tr-overlay="layer" popover="auto" role="menu">
      <button class="tr-menu-item" role="menuitem" data-value="alpha" tabindex="-1">Alpha</button>
      <button class="tr-menu-item" role="menuitem" data-value="disabled" tabindex="-1" disabled>Disabled</button>
      <a class="tr-menu-item" role="menuitem" data-value="beta" tabindex="-1" href="#beta">Beta</a>
    </div>`;
  document.body.append(root);
  const manager = createMenuManager(root);
  const trigger = root.querySelector<HTMLButtonElement>('[data-tr-menu-trigger]')!;
  const content = root.querySelector<HTMLElement>('[role="menu"]')!;
  const alpha = root.querySelector<HTMLElement>('[data-value="alpha"]')!;
  const beta = root.querySelector<HTMLElement>('[data-value="beta"]')!;
  const selected = vi.fn();
  root.addEventListener(menuSelectEventName, selected);

  trigger.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'ArrowDown' }),
  );
  await Promise.resolve();
  expect(content.matches(':popover-open')).toBe(true);
  expect(document.activeElement).toBe(alpha);

  alpha.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'b' }),
  );
  expect(document.activeElement).toBe(beta);

  beta.click();
  expect(selected).toHaveBeenCalledOnce();
  expect(content.matches(':popover-open')).toBe(false);
  manager.destroy();
});
