import { afterEach, expect, test, vi } from 'vitest';
import { tabsChangeEventName } from './contract.js';
import { createTabsManager } from './dom.js';

afterEach(() => document.body.replaceChildren());

function markup() {
  return `
    <div class="tr-tabs" data-tr-tabs data-activation-mode="automatic" data-orientation="horizontal" data-value="one">
      <div role="tablist">
        <button role="tab" data-value="one" aria-selected="true">One</button>
        <button role="tab" data-value="two" aria-selected="false" tabindex="-1">Two</button>
      </div>
      <div role="tabpanel" data-value="one">Panel one</div>
      <div role="tabpanel" data-value="two" hidden>Panel two</div>
    </div>`;
}

test('Tabs DOM manager owns selection and survives DOM replacement', async () => {
  const scope = document.createElement('section');
  scope.innerHTML = markup();
  document.body.append(scope);
  const manager = createTabsManager(scope);
  const root = scope.querySelector<HTMLElement>('[data-tr-tabs]')!;
  let changes = 0;
  root.addEventListener(tabsChangeEventName, () => {
    changes += 1;
  });

  scope.querySelector<HTMLButtonElement>('[data-value="two"]')?.click();
  expect(root.dataset['value']).toBe('two');
  expect(
    root.querySelector<HTMLElement>('[role="tabpanel"][data-value="two"]')?.hidden,
  ).toBe(false);
  expect(changes).toBe(1);

  scope.innerHTML = markup().replaceAll('one', 'alpha').replaceAll('two', 'beta');
  await Promise.resolve();
  const replacement = scope.querySelector<HTMLElement>('[data-tr-tabs]')!;
  replacement.querySelector<HTMLButtonElement>('[data-value="beta"]')?.click();
  expect(replacement.dataset['value']).toBe('beta');
  expect(
    replacement.querySelector<HTMLElement>('[data-value="beta"][role="tabpanel"]')
      ?.hidden,
  ).toBe(false);
  manager.destroy();
});

test('Tabs DOM manager preserves independently selected tabs inserted later', async () => {
  const outer = document.createElement('div');
  outer.dataset['trTabs'] = 'true';
  outer.dataset['value'] = 'preview';
  outer.innerHTML = `
    <div role="tablist">
      <button aria-selected="true" data-value="preview" role="tab">Preview</button>
    </div>
    <div data-value="preview" role="tabpanel"></div>`;
  document.body.append(outer);

  const manager = createTabsManager(outer);
  const nested = document.createElement('div');
  nested.dataset['trTabs'] = 'true';
  nested.dataset['value'] = 'overview';
  nested.innerHTML = `
    <div role="tablist">
      <button aria-selected="true" data-value="overview" role="tab">Overview</button>
      <button aria-selected="false" data-value="logs" role="tab">Logs</button>
    </div>
    <div data-value="overview" role="tabpanel">Rack A is healthy.</div>
    <div data-value="logs" role="tabpanel" hidden>03:18 backup completed.</div>`;
  outer.querySelector<HTMLElement>('[role="tabpanel"]')!.append(nested);
  await Promise.resolve();

  expect(
    nested.querySelector<HTMLElement>('[data-value="overview"][role="tab"]'),
  ).toHaveAttribute('aria-selected', 'true');
  expect(
    nested.querySelector<HTMLElement>('[data-value="overview"][role="tabpanel"]'),
  ).not.toHaveAttribute('hidden');
  manager.destroy();
});

test('Tabs DOM manager scopes discovery to a ShadowRoot', () => {
  const host = document.createElement('div');
  document.body.append(host);
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = markup();
  const manager = createTabsManager(shadow);
  const root = shadow.querySelector<HTMLElement>('[data-tr-tabs]')!;
  root.querySelector<HTMLButtonElement>('[data-value="two"]')?.click();
  expect(root.dataset['value']).toBe('two');
  manager.destroy();
});

test('Tabs DOM manager covers sync fallbacks and select rejection paths', () => {
  const scope = document.createElement('section');
  scope.innerHTML = `${markup()}<div data-tr-tabs><button aria-disabled="true" data-value="disabled" role="tab">Disabled</button><button data-value="enabled" role="tab">Enabled</button><div data-value="enabled" role="tabpanel">Panel</div></div>`;
  document.body.append(scope);
  const manager = createTabsManager(scope);
  const roots = scope.querySelectorAll<HTMLElement>('[data-tr-tabs]');
  const first = roots[0]!;
  const second = roots[1]!;
  delete first.dataset['value'];
  manager.sync(first);
  expect(first.dataset['value']).toBe('one');
  manager.sync(second);
  expect(second.dataset['value']).toBe('enabled');
  expect(manager.select('missing', first)).toBe(false);
  expect(manager.select('disabled', second)).toBe(false);
  expect(manager.select('enabled', second)).toBe(true);
  expect(manager.select('enabled', second)).toBe(true);
  expect(manager.select('one', document.createElement('div'))).toBe(false);
  manager.sync(document.createElement('div'));
  manager.destroy();
});

test('Tabs DOM manager covers keyboard orientation, RTL, manual activation and guards', () => {
  const scope = document.createElement('section');
  scope.innerHTML = markup()
    .replace('data-orientation="horizontal"', 'data-orientation="vertical"')
    .replace('data-activation-mode="automatic"', 'data-activation-mode="manual"');
  document.body.append(scope);
  const manager = createTabsManager(scope);
  const root = scope.querySelector<HTMLElement>('[data-tr-tabs]')!;
  const one = root.querySelector<HTMLElement>('[data-value="one"][role="tab"]')!;
  const two = root.querySelector<HTMLElement>('[data-value="two"][role="tab"]')!;
  one.focus();
  one.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'ArrowDown' }),
  );
  expect(document.activeElement).toBe(two);
  expect(root.dataset['value']).toBe('one');
  two.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: ' ' }),
  );
  expect(root.dataset['value']).toBe('two');
  two.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter' }),
  );
  two.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Home' }),
  );
  one.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'End' }),
  );

  root.dataset['orientation'] = 'horizontal';
  root.dataset['activationMode'] = 'automatic';
  root.style.direction = 'rtl';
  two.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'ArrowRight',
    }),
  );
  expect(document.activeElement).toBe(one);
  one.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'ArrowLeft' }),
  );
  const prevented = new MouseEvent('click', { bubbles: true, cancelable: true });
  prevented.preventDefault();
  two.dispatchEvent(prevented);
  scope.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }),
  );
  scope.dispatchEvent(new Event('keydown', { bubbles: true }));
  const change = vi.fn();
  root.addEventListener(tabsChangeEventName, change);
  one.click();
  expect(change).toHaveBeenCalled();
  manager.destroy();
});

test('Tabs DOM manager covers empty, disabled, document-root and observer fallback paths', async () => {
  const empty = document.createElement('div');
  empty.dataset['trTabs'] = 'true';
  empty.innerHTML = '<button aria-disabled="true" role="tab">Disabled</button>';
  document.body.append(empty);
  const disabled = empty.querySelector<HTMLElement>('[role="tab"]')!;
  const manager = createTabsManager(document);
  disabled.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Home' }),
  );
  disabled.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'ArrowRight',
    }),
  );
  disabled.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter' }),
  );
  disabled.click();
  manager.select('', disabled);
  manager.select('');
  manager.sync(disabled);
  const unrelated = document.createElement('span');
  document.body.append(unrelated);
  await Promise.resolve();
  manager.destroy();

  const originalObserver = window.MutationObserver;
  Object.defineProperty(window, 'MutationObserver', {
    configurable: true,
    value: undefined,
  });
  const withoutObserver = createTabsManager(empty);
  withoutObserver.select('');
  withoutObserver.destroy();
  Object.defineProperty(window, 'MutationObserver', {
    configurable: true,
    value: originalObserver,
  });
});

test('Tabs DOM manager handles missing values across automatic and manual keyboard paths', () => {
  const root = document.createElement('div');
  root.dataset['trTabs'] = 'true';
  root.innerHTML =
    '<button role="tab">No value</button><button data-value="two" role="tab">Two</button><div data-value="two" role="tabpanel"></div>';
  document.body.append(root);
  const manager = createTabsManager(root);
  const noValue = root.querySelector<HTMLElement>('[role="tab"]')!;
  noValue.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Home' }),
  );
  noValue.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'ArrowRight',
    }),
  );
  root.dataset['activationMode'] = 'manual';
  noValue.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: ' ' }),
  );
  manager.destroy();
});
