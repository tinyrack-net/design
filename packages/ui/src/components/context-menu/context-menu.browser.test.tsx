import './context-menu.css';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { ContextMenu, ContextMenuRoot } from './index.js';

test('renders the Tinyrack ContextMenu wrapper', async () => {
  expect(ContextMenu.Root).toBe(ContextMenuRoot);
  await render(
    <ContextMenu.Root>
      <ContextMenu.Trigger>Target</ContextMenu.Trigger>
    </ContextMenu.Root>,
  );
  expect(document.querySelector('.tr-context-menu-trigger')).not.toBeNull();
});

test('opens from the real context event instead of a forced open coordinate', async () => {
  await render(
    <ContextMenu.Root>
      <ContextMenu.Trigger>Rack target</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <ContextMenu.Item>Inspect</ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>,
  );

  document.querySelector('.tr-context-menu-trigger')?.dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      button: 2,
      clientX: 120,
      clientY: 80,
    }),
  );

  await expect
    .poll(() => document.querySelector('.tr-context-menu-popup')?.getAttribute('role'))
    .toBe('menu');
  const positioner = document.querySelector<HTMLElement>('.tr-context-menu-positioner');
  await expect.poll(() => positioner?.style.transform).not.toBe('');
});

test('invokes an enabled command and restores trigger focus', async () => {
  const onClick = vi.fn();
  await render(
    <ContextMenu.Root>
      <ContextMenu.Trigger render={<button type="button" />}>
        Rack target
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <ContextMenu.Item disabled>Unavailable</ContextMenu.Item>
            <ContextMenu.Item onClick={onClick}>Inspect rack</ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('.tr-context-menu-trigger');
  trigger?.focus();
  trigger?.dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      button: 2,
      clientX: 32,
      clientY: 32,
    }),
  );
  await expect.poll(() => document.querySelector('[role="menu"]')).not.toBeNull();
  const disabledItem = Array.from(
    document.querySelectorAll<HTMLElement>('[role="menuitem"]'),
  ).find((item) => item.textContent === 'Unavailable');
  const inspectItem = Array.from(
    document.querySelectorAll<HTMLElement>('[role="menuitem"]'),
  ).find((item) => item.textContent === 'Inspect rack');
  expect(disabledItem?.getAttribute('aria-disabled')).toBe('true');
  await userEvent.click(inspectItem as HTMLElement);
  await expect.poll(() => onClick.mock.calls.length).toBe(1);
  await expect.poll(() => document.activeElement).toBe(trigger);
});
