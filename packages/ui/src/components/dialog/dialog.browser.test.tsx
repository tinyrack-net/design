import '../../core/core.css';
import '../tabs/tabs.css';
import './dialog.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Tabs } from '../tabs/index.js';
import { Dialog, DialogRoot } from './index.js';

test('uses Base UI dialog focus and dismissal behavior', async () => {
  expect(Dialog.Root).toBe(DialogRoot);
  await render(
    <Dialog.Root defaultOpen>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup placement="middle" size="sm">
          <Dialog.Title>Confirm</Dialog.Title>
          <Dialog.Description>Continue?</Dialog.Description>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>,
  );
  const popup = document.querySelector<HTMLElement>('.tr-dialog');
  expect(popup?.getAttribute('role')).toBe('dialog');
  expect(popup?.dataset['size']).toBe('sm');
  document.querySelector<HTMLButtonElement>('.tr-dialog-close')?.click();
  await expect.poll(() => popup?.hasAttribute('data-closed')).toBe(true);
});

test('opens from its trigger and restores focus after close', async () => {
  await render(
    <Dialog.Root>
      <Dialog.Trigger>Open settings</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.Description>Update rack settings.</Dialog.Description>
          <Dialog.Close>Save and close</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('.tr-dialog-trigger');
  trigger?.click();
  await expect
    .poll(() => document.activeElement?.classList.contains('tr-dialog-close'))
    .toBe(true);
  const close = document.querySelector<HTMLButtonElement>('.tr-dialog-close');
  close?.click();
  await expect.poll(() => document.activeElement).toBe(trigger);
});

test('layers modal surfaces above active tabs', async () => {
  await render(
    <>
      <Tabs.Root defaultValue="preview">
        <Tabs.List aria-label="Example tabs">
          <Tabs.Tab value="preview">Preview</Tabs.Tab>
          <Tabs.Tab value="source">Source</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="preview">Preview content</Tabs.Panel>
        <Tabs.Panel value="source">Source content</Tabs.Panel>
      </Tabs.Root>
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <Dialog.Title>Layered dialog</Dialog.Title>
            <Dialog.Description>Modal content stays above the page.</Dialog.Description>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>,
  );

  const activeTab = document.querySelector<HTMLElement>('.tr-tabs-tab[data-active]');
  const backdrop = document.querySelector<HTMLElement>('.tr-dialog-backdrop');
  const popup = document.querySelector<HTMLElement>('.tr-dialog-box');

  expect(activeTab).not.toBeNull();
  expect(backdrop).not.toBeNull();
  expect(popup).not.toBeNull();
  if (activeTab === null || backdrop === null || popup === null) {
    throw new Error('Expected the active tab and dialog layers to render.');
  }
  expect(getComputedStyle(backdrop).zIndex).toBe('1200');
  expect(getComputedStyle(popup).zIndex).toBe('1210');

  const activeTabBounds = activeTab.getBoundingClientRect();
  expect(
    document.elementFromPoint(
      activeTabBounds.left + activeTabBounds.width / 2,
      activeTabBounds.top + activeTabBounds.height / 2,
    ),
  ).toBe(backdrop);
});
