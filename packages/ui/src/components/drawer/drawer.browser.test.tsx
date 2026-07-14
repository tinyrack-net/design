import './drawer.css';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Drawer, DrawerBackdrop } from './index.js';

test('renders the Tinyrack Drawer wrapper', async () => {
  expect(Drawer.Backdrop).toBe(DrawerBackdrop);
  await render(
    <Drawer.Root>
      <Drawer.Trigger>Open drawer</Drawer.Trigger>
    </Drawer.Root>,
  );
  expect(document.querySelector('.tr-drawer-trigger')).not.toBeNull();
});

test('opens a modal task, dismisses with Escape, and restores focus', async () => {
  const onOpenChange = vi.fn();

  await render(
    <Drawer.Root onOpenChange={onOpenChange} swipeDirection="down">
      <Drawer.Trigger>Open settings</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport>
          <Drawer.Popup>
            <Drawer.Content>
              <Drawer.Title>Rack settings</Drawer.Title>
              <Drawer.Description>Update deployment preferences.</Drawer.Description>
              <Drawer.Close>Close settings</Drawer.Close>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('.tr-drawer-trigger');
  trigger?.click();
  await expect
    .poll(() => document.querySelector('.tr-drawer-popup')?.hasAttribute('data-open'))
    .toBe(true);

  const popup = document.querySelector<HTMLElement>('.tr-drawer-popup');
  expect(popup?.getAttribute('role')).toBe('dialog');
  expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(true);

  await userEvent.keyboard('{Escape}');
  await expect.poll(() => document.activeElement).toBe(trigger);
  await expect.poll(() => popup?.hasAttribute('data-open')).toBe(false);
  expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
});

test('links its accessible name and closes from the real backdrop', async () => {
  await render(
    <Drawer.Root swipeDirection="right">
      <Drawer.Trigger>Open deployment</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport>
          <Drawer.Popup>
            <Drawer.Content>
              <Drawer.Title>Deployment</Drawer.Title>
              <Drawer.Description>Deployment settings.</Drawer.Description>
              <Drawer.Close>Done</Drawer.Close>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>,
  );

  document.querySelector<HTMLButtonElement>('.tr-drawer-trigger')?.click();
  await expect
    .poll(() => document.querySelector('.tr-drawer-popup')?.hasAttribute('data-open'))
    .toBe(true);
  const popup = document.querySelector<HTMLElement>('.tr-drawer-popup');
  expect(popup?.getAttribute('aria-labelledby')).toBeTruthy();
  expect(popup?.getAttribute('aria-describedby')).toBeTruthy();
  document.querySelector<HTMLElement>('.tr-drawer-backdrop')?.click();
  await expect.poll(() => popup?.hasAttribute('data-open')).toBe(false);
});
