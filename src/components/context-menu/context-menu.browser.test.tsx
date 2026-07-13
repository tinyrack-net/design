import './context-menu.css';
import { expect, test } from 'vitest';
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
