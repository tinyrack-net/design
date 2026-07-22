import '../../core/core.css';
import './alert-dialog.css';
import { act, type CSSProperties, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRAlertDialog, TRAlertDialogRoot } from './index.js';

function AlertDialogContent() {
  return (
    <TRAlertDialog.Portal>
      <TRAlertDialog.Backdrop />
      <TRAlertDialog.Viewport>
        <TRAlertDialog.Popup>
          <TRAlertDialog.Title>Delete rack?</TRAlertDialog.Title>
          <TRAlertDialog.Description>This cannot be undone.</TRAlertDialog.Description>
          <TRAlertDialog.Close>Cancel</TRAlertDialog.Close>
        </TRAlertDialog.Popup>
      </TRAlertDialog.Viewport>
    </TRAlertDialog.Portal>
  );
}

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
  expect(getComputedStyle(trigger as HTMLButtonElement).cursor).toBe('not-allowed');
  expect(getComputedStyle(trigger as HTMLButtonElement).opacity).toBe('0.5');
  trigger?.click();
  expect(onOpenChange).not.toHaveBeenCalled();
  expect(document.querySelector('.tr-alert-dialog-popup')).toBeNull();
});

test('preserves refs, render, native props, events, classes, and appearance tokens', async () => {
  const triggerRef = createRef<HTMLButtonElement>();
  const popupRef = createRef<HTMLDivElement>();
  const onClick = vi.fn();
  const appearance = {
    '--tr-alert-dialog-popup-background': 'rgb(12 34 56)',
    '--tr-alert-dialog-color': 'rgb(250 250 250)',
    '--tr-alert-dialog-popup-max-width': '18rem',
  } as CSSProperties;

  await render(
    <TRAlertDialog.Root defaultOpen>
      <TRAlertDialog.Trigger
        className="consumer-trigger"
        data-consumer-trigger="preserved"
        onClick={onClick}
        ref={triggerRef}
        render={<button type="button" />}
        title="Delete a rack"
      >
        Delete
      </TRAlertDialog.Trigger>
      <TRAlertDialog.Portal>
        <TRAlertDialog.Backdrop />
        <TRAlertDialog.Viewport>
          <TRAlertDialog.Popup
            className="consumer-popup"
            data-consumer-popup="preserved"
            ref={popupRef}
            style={appearance}
          >
            <TRAlertDialog.Title>Delete rack?</TRAlertDialog.Title>
            <TRAlertDialog.Description>Permanent action.</TRAlertDialog.Description>
            <TRAlertDialog.Close>Cancel</TRAlertDialog.Close>
          </TRAlertDialog.Popup>
        </TRAlertDialog.Viewport>
      </TRAlertDialog.Portal>
    </TRAlertDialog.Root>,
  );

  expect(triggerRef.current).toHaveClass('tr-alert-dialog-trigger', 'consumer-trigger');
  expect(triggerRef.current?.dataset['consumerTrigger']).toBe('preserved');
  expect(triggerRef.current?.title).toBe('Delete a rack');
  expect(triggerRef.current?.type).toBe('button');
  expect(popupRef.current).toHaveClass('tr-alert-dialog-popup', 'consumer-popup');
  expect(popupRef.current?.dataset['consumerPopup']).toBe('preserved');
  const popupStyle = getComputedStyle(popupRef.current as HTMLDivElement);
  expect(popupStyle.backgroundColor).toBe('rgb(12, 34, 56)');
  expect(popupStyle.color).toBe('rgb(250, 250, 250)');
  expect((popupRef.current as HTMLDivElement).getBoundingClientRect().width).toBe(288);

  triggerRef.current?.click();
  expect(onClick).toHaveBeenCalledOnce();
});

test('keeps controlled dialogs open until the owner accepts dismissal', async () => {
  const onOpenChange = vi.fn();
  await render(
    <TRAlertDialog.Root onOpenChange={onOpenChange} open>
      <TRAlertDialog.Trigger>Delete controlled rack</TRAlertDialog.Trigger>
      <AlertDialogContent />
    </TRAlertDialog.Root>,
  );

  await expect.poll(() => document.activeElement?.textContent).toBe('Cancel');
  await userEvent.keyboard('{Escape}');
  expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
  expect(
    document.querySelector('.tr-alert-dialog-popup')?.hasAttribute('data-open'),
  ).toBe(true);
});

test('supports detached handles with payloads and a custom portal container', async () => {
  const handle = TRAlertDialog.createHandle<{ rack: string }>();
  const portalContainer = document.createElement('div');
  document.body.append(portalContainer);
  await render(
    <>
      <TRAlertDialog.Trigger handle={handle} payload={{ rack: 'Rack Delta' }}>
        Delete detached rack
      </TRAlertDialog.Trigger>
      <TRAlertDialog.Root handle={handle}>
        {({ payload }) => (
          <TRAlertDialog.Portal container={portalContainer}>
            <TRAlertDialog.Backdrop />
            <TRAlertDialog.Viewport>
              <TRAlertDialog.Popup>
                <TRAlertDialog.Title>
                  Delete {(payload as { rack: string } | undefined)?.rack ?? 'rack'}?
                </TRAlertDialog.Title>
                <TRAlertDialog.Description>Permanent action.</TRAlertDialog.Description>
                <TRAlertDialog.Close>Cancel</TRAlertDialog.Close>
              </TRAlertDialog.Popup>
            </TRAlertDialog.Viewport>
          </TRAlertDialog.Portal>
        )}
      </TRAlertDialog.Root>
    </>,
  );

  await userEvent.click(
    document.querySelector<HTMLButtonElement>(
      '.tr-alert-dialog-trigger',
    ) as HTMLButtonElement,
  );
  await expect
    .poll(() => portalContainer.querySelector('.tr-alert-dialog-title')?.textContent)
    .toBe('Delete Rack Delta?');
  expect(portalContainer.querySelector('.tr-alert-dialog-popup')).not.toBeNull();
  portalContainer.remove();
});

test('does not close through a disabled cancel control', async () => {
  await render(
    <TRAlertDialog.Root defaultOpen>
      <TRAlertDialog.Portal>
        <TRAlertDialog.Backdrop />
        <TRAlertDialog.Viewport>
          <TRAlertDialog.Popup>
            <TRAlertDialog.Title>Delete rack?</TRAlertDialog.Title>
            <TRAlertDialog.Description>Permanent action.</TRAlertDialog.Description>
            <TRAlertDialog.Close disabled>Cancel</TRAlertDialog.Close>
            <TRAlertDialog.Close>Delete</TRAlertDialog.Close>
          </TRAlertDialog.Popup>
        </TRAlertDialog.Viewport>
      </TRAlertDialog.Portal>
    </TRAlertDialog.Root>,
  );

  const cancel = document.querySelector<HTMLButtonElement>('.tr-alert-dialog-close');
  expect(cancel?.disabled).toBe(true);
  cancel?.click();
  expect(
    document.querySelector('.tr-alert-dialog-popup')?.hasAttribute('data-open'),
  ).toBe(true);
});

test('server-renders and hydrates before opening its portal', async () => {
  const fixture = (
    <TRAlertDialog.Root>
      <TRAlertDialog.Trigger>Hydrated delete</TRAlertDialog.Trigger>
      <AlertDialogContent />
    </TRAlertDialog.Root>
  );
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, fixture, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  try {
    await act(async () => {});
    expect(hydrationErrors).toEqual([]);
    await userEvent.click(
      host.querySelector<HTMLButtonElement>(
        '.tr-alert-dialog-trigger',
      ) as HTMLButtonElement,
    );
    await expect
      .poll(() =>
        document.querySelector('.tr-alert-dialog-popup')?.hasAttribute('data-open'),
      )
      .toBe(true);
  } finally {
    await act(async () => root.unmount());
    host.remove();
  }
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
