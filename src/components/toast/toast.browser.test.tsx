import '../../core/core.css';
import './toast.css';
import { afterEach, expect, test, vi } from 'vitest';
import { createToastManager } from './dom.js';

afterEach(() => document.body.replaceChildren());

test('Toast supports fixed ids, update, actions and dismiss', () => {
  const root = document.createElement('div');
  document.body.append(root);
  const manager = createToastManager(root);
  const action = vi.fn();
  const id = manager.show({
    action: { label: 'Retry', onAction: action },
    duration: 0,
    id: 'sync-error',
    title: 'Sync failed',
    variant: 'danger',
  });

  expect(id).toBe('sync-error');
  expect(root.querySelector('[role="alert"]')?.textContent).toContain('Sync failed');
  expect(manager.update(id, { description: 'Network unavailable' })).toBe(true);
  expect(root.textContent).toContain('Network unavailable');

  root.querySelector<HTMLButtonElement>('[data-tr-toast-action]')?.click();
  expect(action).toHaveBeenCalledWith(id);
  expect(root.querySelector('[data-toast-id="sync-error"]')).toBeNull();
  manager.destroy();
});

test('Toast pauses its timer while hovered and resumes afterward', async () => {
  const root = document.createElement('div');
  document.body.append(root);
  const manager = createToastManager(root);
  manager.show({ duration: 40, id: 'timer', title: 'Working' });
  const toast = root.querySelector<HTMLElement>('[data-toast-id="timer"]')!;
  toast.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 70));
  expect(root.querySelector('[data-toast-id="timer"]')).not.toBeNull();

  toast.dispatchEvent(new PointerEvent('pointerout', { bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 70));
  expect(root.querySelector('[data-toast-id="timer"]')).toBeNull();
  manager.destroy();
});

test('Toast creates its viewport inside the provided ShadowRoot', () => {
  const host = document.createElement('div');
  document.body.append(host);
  const shadow = host.attachShadow({ mode: 'open' });
  const manager = createToastManager(shadow);
  manager.show({ duration: 0, title: 'Translated' });

  const viewport = shadow.querySelector('[data-tr-toast-viewport]');
  expect(viewport).not.toBeNull();
  expect(viewport?.getRootNode()).toBe(shadow);
  manager.destroy();
});

test.each([
  ['info', 'rgb(37, 99, 235)'],
  ['success', 'rgb(22, 163, 74)'],
  ['warning', 'rgb(217, 119, 6)'],
  ['danger', 'rgb(220, 38, 38)'],
] as const)('Toast %s uses the matching semantic border role', (variant, accent) => {
  document.documentElement.dataset.theme = 'tinyrack-light';
  const root = document.createElement('div');
  document.body.append(root);
  const manager = createToastManager(root);
  manager.show({ duration: 0, id: variant, title: variant, variant });

  const toast = root.querySelector<HTMLElement>(`[data-toast-id="${variant}"]`);
  if (toast === null) {
    throw new Error(`Unable to find ${variant} toast.`);
  }
  expect(getComputedStyle(toast).borderInlineStartColor).toBe(accent);
  manager.destroy();
});
