import './dialog.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
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
