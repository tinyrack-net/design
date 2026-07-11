import '../../core/core.css';
import './toast.css';
import { expect, test, vi } from 'vitest';
import { toastChangeEventName, toastPositions, toastVariants } from './contract.js';
import { createToastManager } from './dom.js';

test('Toast DOM manager covers every variant, position and update path', () => {
  const root = document.createElement('div');
  document.body.append(root);
  const manager = createToastManager(root);
  const changes = vi.fn();
  root.addEventListener(toastChangeEventName, changes);
  manager.show({ id: 'defaults', title: 'Defaults' });
  manager.dismiss('defaults');
  for (const [index, position] of toastPositions.entries()) {
    for (const variant of toastVariants) {
      manager.show({
        closeLabel: 'Close',
        description: 'Details',
        duration: 0,
        id: `${index}-${variant}`,
        position,
        title: variant,
        variant,
      });
    }
  }
  expect(root.querySelectorAll('[data-tr-toast-viewport]')).toHaveLength(
    toastPositions.length,
  );
  expect(root.querySelectorAll('[role="alert"]')).toHaveLength(toastPositions.length);
  expect(manager.update('missing', { title: 'Nope' })).toBe(false);
  expect(
    manager.update('0-neutral', {
      duration: Number.POSITIVE_INFINITY,
      position: 'block-end-center',
      title: 'Moved',
      variant: 'danger',
    }),
  ).toBe(true);
  expect(
    root.querySelector('[data-position="block-end-center"] [data-toast-id="0-neutral"]')
      ?.textContent,
  ).toContain('Moved');
  expect(manager.show({ duration: 0, id: '0-neutral', title: 'Duplicate' })).toBe(
    '0-neutral',
  );
  expect(
    changes.mock.calls.map(([event]) => (event as CustomEvent).detail.reason),
  ).toContain('update');
  manager.dismiss('missing');
  manager.dismiss();
  expect(root.querySelector('[data-toast-id]')).toBeNull();
  manager.destroy();
  root.remove();
});

test('Toast DOM manager covers action, close, event guards and popover fallbacks', () => {
  const root = document.createElement('div');
  document.body.append(root);
  const showPopover = vi
    .spyOn(HTMLElement.prototype, 'showPopover')
    .mockImplementation(() => {
      throw new Error('blocked');
    });
  const manager = createToastManager(root);
  const action = vi.fn();
  manager.show({
    action: { label: 'Retry', onAction: action },
    duration: 0,
    id: 'action',
    title: 'Failed',
  });
  const viewport = root.querySelector<HTMLElement>('[data-tr-toast-viewport]')!;
  expect(viewport.dataset['open']).toBe('true');
  vi.spyOn(viewport, 'hidePopover').mockImplementation(() => {
    throw new Error('blocked');
  });
  root.querySelector<HTMLElement>('[data-tr-toast-action]')?.click();
  expect(action).toHaveBeenCalledWith('action');
  expect(viewport.dataset['open']).toBe('false');

  manager.show({
    action: { label: 'No callback' },
    duration: 0,
    id: 'close',
    title: 'Close me',
  });
  root.querySelector<HTMLElement>('[data-toast-id="close"]')?.click();
  root.querySelector<HTMLElement>('[data-tr-toast-close]')?.click();
  const prevented = new MouseEvent('click', { bubbles: true, cancelable: true });
  prevented.preventDefault();
  root.dispatchEvent(prevented);
  root.dispatchEvent(new Event('click', { bubbles: true }));
  const rogue = document.createElement('button');
  rogue.dataset['toastId'] = 'missing';
  root.append(rogue);
  rogue.click();
  for (const type of ['pointerover', 'pointerout', 'focusin', 'focusout']) {
    root.dispatchEvent(new Event(type, { bubbles: true }));
    rogue.dispatchEvent(new Event(type, { bubbles: true }));
  }
  manager.destroy();
  showPopover.mockRestore();
  root.remove();
});

test('Toast DOM manager covers timers, focus, window and visibility pauses', async () => {
  vi.useFakeTimers();
  const originalVisibility = Object.getOwnPropertyDescriptor(
    Document.prototype,
    'visibilityState',
  );
  const root = document.createElement('div');
  document.body.append(root);
  const manager = createToastManager(document);
  const changes = vi.fn();
  document.addEventListener(toastChangeEventName, changes);
  manager.show({ duration: 100, id: 'timer', title: 'Timer' });
  const toast = document.querySelector<HTMLElement>('[data-toast-id="timer"]')!;
  toast.querySelector<HTMLButtonElement>('[data-tr-toast-close]')?.focus();
  toast.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
  await vi.advanceTimersByTimeAsync(150);
  expect(document.querySelector('[data-toast-id="timer"]')).not.toBeNull();
  document.body.tabIndex = -1;
  document.body.focus();
  toast.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
  await Promise.resolve();
  await vi.advanceTimersByTimeAsync(150);
  expect(document.querySelector('[data-toast-id="timer"]')).toBeNull();

  manager.show({ duration: 100, id: 'window', title: 'Window' });
  window.dispatchEvent(new Event('blur'));
  await vi.advanceTimersByTimeAsync(150);
  expect(document.querySelector('[data-toast-id="window"]')).not.toBeNull();
  window.dispatchEvent(new Event('focus'));
  await vi.advanceTimersByTimeAsync(150);
  expect(document.querySelector('[data-toast-id="window"]')).toBeNull();

  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    value: 'hidden',
  });
  manager.show({ duration: 100, id: 'visibility', title: 'Visibility' });
  document.dispatchEvent(new Event('visibilitychange'));
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    value: 'visible',
  });
  document.dispatchEvent(new Event('visibilitychange'));
  await vi.advanceTimersByTimeAsync(150);
  expect(
    changes.mock.calls.map(([event]) => (event as CustomEvent).detail.reason),
  ).toContain('timeout');
  manager.destroy();
  document.removeEventListener(toastChangeEventName, changes);
  Reflect.deleteProperty(document, 'visibilityState');
  if (originalVisibility !== undefined)
    Object.defineProperty(Document.prototype, 'visibilityState', originalVisibility);
  vi.useRealTimers();
  root.remove();
});

test('Toast DOM manager reuses a viewport root and scopes ShadowRoot output', () => {
  const viewport = document.createElement('section');
  viewport.dataset['position'] = 'block-end-inline-end';
  viewport.dataset['trToastViewport'] = 'true';
  viewport.setAttribute('popover', 'manual');
  document.body.append(viewport);
  const direct = createToastManager(viewport);
  direct.show({ duration: 0, title: 'Direct' });
  expect(viewport.querySelector('[data-toast-id]')).not.toBeNull();
  direct.destroy();
  const host = document.createElement('div');
  document.body.append(host);
  const shadow = host.attachShadow({ mode: 'open' });
  const scoped = createToastManager(shadow);
  scoped.show({ duration: 0, title: 'Shadow' });
  expect(shadow.querySelector('[data-toast-id]')).not.toBeNull();
  scoped.destroy();
  viewport.remove();
  host.remove();
});
