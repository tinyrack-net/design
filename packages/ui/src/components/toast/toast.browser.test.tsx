import '../../core/core.css';
import './toast.css';
import { useEffect, useRef } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { createToastManager, Toast, ToastProvider, useToastManager } from './index.js';

function ToastExample() {
  const manager = useToastManager();
  const added = useRef(false);

  useEffect(() => {
    if (added.current) return;
    added.current = true;
    manager.add({
      description: 'Deployment completed.',
      title: 'Success',
      type: 'success',
      timeout: 0,
    });
    manager.add({
      description: 'No status was supplied.',
      title: 'Neutral',
      timeout: 0,
    });
    manager.add({
      description: 'The wrapper overrides this status.',
      title: 'Explicit',
      timeout: 0,
      type: 'info',
    });
  }, [manager]);

  return (
    <Toast.Portal>
      <Toast.Viewport position="block-end-inline-end">
        {manager.toasts.map((toast) => (
          <Toast.Root
            key={toast.id}
            toast={toast}
            variant={toast.title === 'Explicit' ? 'danger' : undefined}
          >
            <div>
              <Toast.Title>{toast.title}</Toast.Title>
              <Toast.Description>{toast.description}</Toast.Description>
            </div>
            <Toast.Action>Undo</Toast.Action>
            <Toast.Close aria-label="Dismiss notification">×</Toast.Close>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

test('assembles Base UI toast management and parts', async () => {
  expect(Toast.Provider).toBe(ToastProvider);
  expect(typeof createToastManager().add).toBe('function');
  await render(
    <Toast.Provider>
      <ToastExample />
    </Toast.Provider>,
  );
  await expect.poll(() => document.querySelectorAll('.tr-toast').length).toBe(3);
  expect(
    Array.from(document.querySelectorAll<HTMLElement>('.tr-toast')).map(
      (toast) => toast.dataset['variant'],
    ),
  ).toEqual(['danger', 'neutral', 'success']);
  expect(
    Array.from(
      document.querySelectorAll('.tr-toast-title'),
      (title) => title.textContent,
    ),
  ).toContain('Success');

  const viewport = document.querySelector<HTMLElement>('.tr-toast-viewport');
  expect(viewport).not.toBeNull();
  const viewportStyle = getComputedStyle(viewport as HTMLElement);
  const viewportRect = (viewport as HTMLElement).getBoundingClientRect();
  expect(viewportStyle.position).toBe('fixed');
  expect(viewportStyle.boxSizing).toBe('border-box');
  expect(viewportRect.right).toBeLessThanOrEqual(document.documentElement.clientWidth);
  expect(viewportRect.bottom).toBeLessThanOrEqual(
    document.documentElement.clientHeight,
  );
  expect(Math.round(document.documentElement.clientWidth - viewportRect.right)).toBe(
    16,
  );
  expect(Math.round(document.documentElement.clientHeight - viewportRect.bottom)).toBe(
    16,
  );

  const closeButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>('.tr-toast-close'),
  );
  expect(closeButtons).toHaveLength(3);
  expect(
    closeButtons.every((button) => button.ariaLabel === 'Dismiss notification'),
  ).toBe(true);
  const closeStyle = getComputedStyle(closeButtons[0] as HTMLButtonElement);
  const closeRect = (closeButtons[0] as HTMLButtonElement).getBoundingClientRect();
  expect(closeStyle.display).toBe('flex');
  expect(closeStyle.alignItems).toBe('center');
  expect(closeStyle.justifyContent).toBe('center');
  expect(closeRect.width).toBe(closeRect.height);
});
