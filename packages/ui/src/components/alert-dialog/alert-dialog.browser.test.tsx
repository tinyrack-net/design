import './alert-dialog.css';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRAlertDialog, TRAlertDialogRoot } from './index.js';

test('renders the Tinyrack TRAlertDialog wrapper', async () => {
  expect(TRAlertDialog.Root).toBe(TRAlertDialogRoot);
  await render(
    <TRAlertDialog.Root>
      <TRAlertDialog.Trigger>Delete</TRAlertDialog.Trigger>
    </TRAlertDialog.Root>,
  );
  expect(document.querySelector('.tr-alert-dialog-trigger')).not.toBeNull();
});

test('opens an alert task, dismisses with Escape, and restores focus', async () => {
  const onOpenChange = vi.fn();

  await render(
    <TRAlertDialog.Root onOpenChange={onOpenChange}>
      <TRAlertDialog.Trigger>Delete rack</TRAlertDialog.Trigger>
      <TRAlertDialog.Portal>
        <TRAlertDialog.Backdrop />
        <TRAlertDialog.Viewport>
          <TRAlertDialog.Popup>
            <TRAlertDialog.Title>Delete rack?</TRAlertDialog.Title>
            <TRAlertDialog.Description>
              This action permanently removes Rack Alpha.
            </TRAlertDialog.Description>
            <div className="tr-alert-dialog-actions">
              <TRAlertDialog.Close>Cancel</TRAlertDialog.Close>
              <TRAlertDialog.Close>Delete</TRAlertDialog.Close>
            </div>
          </TRAlertDialog.Popup>
        </TRAlertDialog.Viewport>
      </TRAlertDialog.Portal>
    </TRAlertDialog.Root>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('.tr-alert-dialog-trigger');
  await userEvent.click(trigger as HTMLButtonElement);
  await expect
    .poll(() =>
      document.querySelector('.tr-alert-dialog-popup')?.hasAttribute('data-open'),
    )
    .toBe(true);

  const popup = document.querySelector<HTMLElement>('.tr-alert-dialog-popup');
  expect(popup?.getAttribute('role')).toBe('alertdialog');
  expect(popup?.getAttribute('aria-labelledby')).toBeTruthy();
  expect(popup?.getAttribute('aria-describedby')).toBeTruthy();
  expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(true);
  expect(document.activeElement?.textContent).toBe('Cancel');

  const actions = document.querySelector<HTMLElement>('.tr-alert-dialog-actions');
  const actionStyle = getComputedStyle(actions as HTMLElement);
  const actionButtons = actions?.querySelectorAll<HTMLButtonElement>(
    '.tr-alert-dialog-close',
  );
  expect(actionStyle.display).toBe('flex');
  expect(actionStyle.flexDirection).toBe('row');
  expect(actionStyle.flexWrap).toBe('wrap');
  expect(actionStyle.justifyContent).toBe('flex-end');
  expect(actionButtons).toHaveLength(2);
  expect(actionButtons?.[0]?.getBoundingClientRect().top).toBe(
    actionButtons?.[1]?.getBoundingClientRect().top,
  );

  await userEvent.keyboard('{Escape}');
  await expect.poll(() => document.activeElement).toBe(trigger);
  await expect.poll(() => popup?.hasAttribute('data-open')).toBe(false);
  expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
});

test('blocks disabled triggers', async () => {
  const onOpenChange = vi.fn();

  await render(
    <TRAlertDialog.Root onOpenChange={onOpenChange}>
      <TRAlertDialog.Trigger disabled>Delete rack</TRAlertDialog.Trigger>
      <TRAlertDialog.Portal>
        <TRAlertDialog.Backdrop />
        <TRAlertDialog.Viewport>
          <TRAlertDialog.Popup>
            <TRAlertDialog.Title>Delete rack?</TRAlertDialog.Title>
            <TRAlertDialog.Description>
              This action cannot be undone.
            </TRAlertDialog.Description>
            <TRAlertDialog.Close>Cancel</TRAlertDialog.Close>
          </TRAlertDialog.Popup>
        </TRAlertDialog.Viewport>
      </TRAlertDialog.Portal>
    </TRAlertDialog.Root>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('.tr-alert-dialog-trigger');
  expect(trigger?.disabled).toBe(true);
  trigger?.click();
  expect(onOpenChange).not.toHaveBeenCalled();
  expect(document.querySelector('.tr-alert-dialog-popup')).toBeNull();
});

test('traps focus, ignores backdrop dismissal, and closes through an action', async () => {
  await render(
    <TRAlertDialog.Root>
      <TRAlertDialog.Trigger>Remove rack</TRAlertDialog.Trigger>
      <TRAlertDialog.Portal>
        <TRAlertDialog.Backdrop />
        <TRAlertDialog.Viewport>
          <TRAlertDialog.Popup>
            <TRAlertDialog.Title>Remove rack?</TRAlertDialog.Title>
            <TRAlertDialog.Description>
              This cannot be undone.
            </TRAlertDialog.Description>
            <div className="tr-alert-dialog-actions">
              <TRAlertDialog.Close>Cancel</TRAlertDialog.Close>
              <TRAlertDialog.Close>Remove</TRAlertDialog.Close>
            </div>
          </TRAlertDialog.Popup>
        </TRAlertDialog.Viewport>
      </TRAlertDialog.Portal>
    </TRAlertDialog.Root>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('.tr-alert-dialog-trigger');
  trigger?.click();
  await expect.poll(() => document.activeElement?.textContent).toBe('Cancel');
  await userEvent.keyboard('{Tab}');
  expect(document.activeElement?.textContent).toBe('Remove');
  await userEvent.keyboard('{Tab}');
  await expect.poll(() => document.activeElement?.textContent).toBe('Cancel');

  document.querySelector<HTMLElement>('.tr-alert-dialog-backdrop')?.click();
  expect(
    document.querySelector('.tr-alert-dialog-popup')?.hasAttribute('data-open'),
  ).toBe(true);
  document.querySelectorAll<HTMLButtonElement>('.tr-alert-dialog-close')[1]?.click();
  await expect.poll(() => document.activeElement).toBe(trigger);
});
