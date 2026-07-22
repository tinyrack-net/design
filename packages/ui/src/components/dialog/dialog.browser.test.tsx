import '../../core/core.css';
import '../tabs/tabs.css';
import './dialog.css';
import { act, useRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRTabs } from '../tabs/index.js';
import { TRDialog, type TRDialogPopupProps, TRDialogRoot } from './index.js';

const invalidSize: TRDialogPopupProps = {
  // @ts-expect-error TRDialog.Popup no longer exposes a size recipe.
  size: 'sm',
};
void invalidSize;

test('uses Base UI dialog focus and dismissal behavior', async () => {
  expect(TRDialog.Root).toBe(TRDialogRoot);
  await render(
    <TRDialog.Root defaultOpen>
      <TRDialog.Trigger>Open</TRDialog.Trigger>
      <TRDialog.Portal>
        <TRDialog.Backdrop />
        <TRDialog.Popup placement="middle">
          <TRDialog.Title>Confirm</TRDialog.Title>
          <TRDialog.Description>Continue?</TRDialog.Description>
          <TRDialog.Close>Close</TRDialog.Close>
        </TRDialog.Popup>
      </TRDialog.Portal>
    </TRDialog.Root>,
  );
  const popup = document.querySelector<HTMLElement>('.tr-dialog');
  expect(popup?.getAttribute('role')).toBe('dialog');
  expect(popup?.hasAttribute('data-size')).toBe(false);
  document.querySelector<HTMLButtonElement>('.tr-dialog-close')?.click();
  await expect.poll(() => popup?.hasAttribute('data-closed')).toBe(true);
});

test('opens from its trigger and restores focus after close', async () => {
  await render(
    <TRDialog.Root>
      <TRDialog.Trigger>Open settings</TRDialog.Trigger>
      <TRDialog.Portal>
        <TRDialog.Backdrop />
        <TRDialog.Popup>
          <TRDialog.Title>Settings</TRDialog.Title>
          <TRDialog.Description>Update rack settings.</TRDialog.Description>
          <TRDialog.Close>Save and close</TRDialog.Close>
        </TRDialog.Popup>
      </TRDialog.Portal>
    </TRDialog.Root>,
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
      <TRTabs.Root defaultValue="preview">
        <TRTabs.List aria-label="Example tabs">
          <TRTabs.Tab value="preview">Preview</TRTabs.Tab>
          <TRTabs.Tab value="source">Source</TRTabs.Tab>
        </TRTabs.List>
        <TRTabs.Panel value="preview">Preview content</TRTabs.Panel>
        <TRTabs.Panel value="source">Source content</TRTabs.Panel>
      </TRTabs.Root>
      <TRDialog.Root defaultOpen>
        <TRDialog.Portal>
          <TRDialog.Backdrop />
          <TRDialog.Popup>
            <TRDialog.Title>Layered dialog</TRDialog.Title>
            <TRDialog.Description>
              Modal content stays above the page.
            </TRDialog.Description>
            <TRDialog.Close>Close</TRDialog.Close>
          </TRDialog.Popup>
        </TRDialog.Portal>
      </TRDialog.Root>
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
  expect(getComputedStyle(backdrop).zIndex).toBe('900');
  expect(getComputedStyle(popup).zIndex).toBe('1210');

  const activeTabBounds = activeTab.getBoundingClientRect();
  expect(
    document.elementFromPoint(
      activeTabBounds.left + activeTabBounds.width / 2,
      activeTabBounds.top + activeTabBounds.height / 2,
    ),
  ).toBe(backdrop);
});

test('omits size recipes for both top and bottom edge placements', async () => {
  const top = await render(
    <TRDialog.Root defaultOpen modal={false}>
      <TRDialog.Portal>
        <TRDialog.Popup placement="top">
          <TRDialog.Title>Top notice</TRDialog.Title>
          <TRDialog.Description>Anchored to the top edge.</TRDialog.Description>
        </TRDialog.Popup>
      </TRDialog.Portal>
    </TRDialog.Root>,
  );
  const topPopup = document.querySelector<HTMLElement>('.tr-dialog-box');
  expect(topPopup?.dataset['placement']).toBe('top');
  expect(topPopup?.hasAttribute('data-size')).toBe(false);
  await top.unmount();

  await render(
    <TRDialog.Root defaultOpen modal={false}>
      <TRDialog.Portal>
        <TRDialog.Popup placement="bottom">
          <TRDialog.Title>Bottom notice</TRDialog.Title>
          <TRDialog.Description>Anchored to the bottom edge.</TRDialog.Description>
        </TRDialog.Popup>
      </TRDialog.Portal>
    </TRDialog.Root>,
  );
  const bottomPopup = document.querySelector<HTMLElement>('.tr-dialog-box');
  expect(bottomPopup?.dataset['placement']).toBe('bottom');
  expect(bottomPopup?.hasAttribute('data-size')).toBe(false);
});

test('preserves controlled state and reports real dismissal reasons', async () => {
  const changes: Array<[boolean, string]> = [];

  function ControlledDialog() {
    const [open, setOpen] = useState(false);
    return (
      <TRDialog.Root
        open={open}
        onOpenChange={(nextOpen, details) => {
          changes.push([nextOpen, details.reason]);
          setOpen(nextOpen);
        }}
      >
        <TRDialog.Trigger>Open controlled dialog</TRDialog.Trigger>
        <TRDialog.Portal>
          <TRDialog.Backdrop />
          <TRDialog.Viewport>
            <TRDialog.Popup>
              <TRDialog.Title>Controlled dialog</TRDialog.Title>
              <TRDialog.Description>Controlled by React state.</TRDialog.Description>
              <TRDialog.Close>Close controlled dialog</TRDialog.Close>
            </TRDialog.Popup>
          </TRDialog.Viewport>
        </TRDialog.Portal>
      </TRDialog.Root>
    );
  }

  await render(<ControlledDialog />);
  const trigger = page.getByRole('button', { name: 'Open controlled dialog' });
  await userEvent.click(trigger.element());
  await expect
    .element(page.getByRole('dialog', { name: 'Controlled dialog' }))
    .toBeVisible();
  expect(changes.at(-1)).toEqual([true, 'trigger-press']);

  await userEvent.keyboard('{Escape}');
  await expect
    .poll(() => document.querySelector('.tr-dialog-box')?.hasAttribute('data-open'))
    .toBe(false);
  expect(changes.at(-1)).toEqual([false, 'escape-key']);
  await expect.poll(() => document.activeElement).toBe(trigger.element());

  await userEvent.click(trigger.element());
  const backdrop = document.querySelector<HTMLElement>('.tr-dialog-backdrop');
  if (backdrop === null) throw new Error('Expected the dialog backdrop to render.');
  await page.elementLocator(backdrop).click({ position: { x: 1, y: 1 } });
  await expect
    .poll(() => document.querySelector('.tr-dialog-box')?.hasAttribute('data-open'))
    .toBe(false);
  expect(changes.at(-1)).toEqual([false, 'outside-press']);
});

test('traps focus, locks page scroll, supports refs, and honors render props', async () => {
  const triggerRef = { current: null as HTMLButtonElement | null };
  const popupRef = { current: null as HTMLDivElement | null };

  await render(
    <TRDialog.Root>
      <TRDialog.Trigger
        ref={triggerRef}
        render={<button data-rendered-trigger="" type="button" />}
      >
        Open rendered trigger
      </TRDialog.Trigger>
      <TRDialog.Portal>
        <TRDialog.Backdrop />
        <TRDialog.Viewport>
          <TRDialog.Popup id="dialog-content" ref={popupRef}>
            <TRDialog.Title>Focus contract</TRDialog.Title>
            <TRDialog.Description>Focus remains in this dialog.</TRDialog.Description>
            <button type="button">First action</button>
            <TRDialog.Close>Last action</TRDialog.Close>
          </TRDialog.Popup>
        </TRDialog.Viewport>
      </TRDialog.Portal>
    </TRDialog.Root>,
  );

  expect(triggerRef.current?.hasAttribute('data-rendered-trigger')).toBe(true);
  if (triggerRef.current === null) throw new Error('Expected the trigger ref.');
  await userEvent.click(triggerRef.current);
  expect(popupRef.current?.getAttribute('role')).toBe('dialog');
  expect(getComputedStyle(document.body).overflow).toBe('hidden');
  await expect.poll(() => document.activeElement?.textContent).toBe('First action');
  await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
  await expect.poll(() => document.activeElement?.textContent).toBe('Last action');
  await userEvent.click(page.getByRole('button', { name: 'Last action' }).element());
  await expect.poll(() => getComputedStyle(document.body).overflow).not.toBe('hidden');
});

test('portals into a custom container and keeps every placement in the viewport', async () => {
  const portalContainer = document.createElement('div');
  portalContainer.dir = 'rtl';
  document.body.append(portalContainer);

  try {
    for (const placement of ['middle', 'top', 'bottom', 'start', 'end'] as const) {
      const rendered = await render(
        <TRDialog.Root defaultOpen modal={false}>
          <TRDialog.Portal container={portalContainer}>
            <TRDialog.Backdrop />
            <TRDialog.Viewport>
              <TRDialog.Popup dir="rtl" placement={placement}>
                <TRDialog.Title>{placement} placement</TRDialog.Title>
                <TRDialog.Description>Visible placement.</TRDialog.Description>
              </TRDialog.Popup>
            </TRDialog.Viewport>
          </TRDialog.Portal>
        </TRDialog.Root>,
      );
      const popup = portalContainer.querySelector<HTMLElement>('.tr-dialog-box');
      if (popup === null) throw new Error('Expected the portaled dialog popup.');
      const bounds = popup.getBoundingClientRect();
      expect(bounds.left).toBeGreaterThanOrEqual(0);
      expect(bounds.right).toBeLessThanOrEqual(window.innerWidth);
      if (placement === 'start') {
        expect(window.innerWidth - bounds.right).toBeLessThan(bounds.left);
      }
      if (placement === 'end') {
        expect(bounds.left).toBeLessThan(window.innerWidth - bounds.right);
      }
      await rendered.unmount();
    }
  } finally {
    portalContainer.remove();
  }
});

test('connects a detached payload trigger through the public handle', async () => {
  const handle = TRDialog.createHandle<{ rack: string }>();
  await render(
    <>
      <TRDialog.Trigger handle={handle} payload={{ rack: 'Rack Delta' }}>
        Inspect detached rack
      </TRDialog.Trigger>
      <TRDialog.Root handle={handle}>
        {({ payload }) => (
          <TRDialog.Portal>
            <TRDialog.Popup>
              <TRDialog.Title>{payload?.rack ?? 'Waiting for rack'}</TRDialog.Title>
              <TRDialog.Description>Detached payload dialog.</TRDialog.Description>
              <TRDialog.Close>Close payload dialog</TRDialog.Close>
            </TRDialog.Popup>
          </TRDialog.Portal>
        )}
      </TRDialog.Root>
    </>,
  );

  await userEvent.click(
    page.getByRole('button', { name: 'Inspect detached rack' }).element(),
  );
  await expect.element(page.getByRole('dialog', { name: 'Rack Delta' })).toBeVisible();
  expect(handle.isOpen).toBe(true);
  handle.close();
  await expect.poll(() => handle.isOpen).toBe(false);
});

test('server-renders and hydrates a default-open dialog without recoverable errors', async () => {
  function HydratedDialog() {
    const closeRef = useRef<HTMLButtonElement>(null);
    return (
      <TRDialog.Root defaultOpen>
        <TRDialog.Portal>
          <TRDialog.Popup initialFocus={closeRef}>
            <TRDialog.Title>Hydrated dialog</TRDialog.Title>
            <TRDialog.Description>Rendered on the server.</TRDialog.Description>
            <TRDialog.Close ref={closeRef}>Close hydrated dialog</TRDialog.Close>
          </TRDialog.Popup>
        </TRDialog.Portal>
      </TRDialog.Root>
    );
  }

  const host = document.createElement('div');
  host.innerHTML = renderToString(<HydratedDialog />);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const actEnvironment = globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  };
  const previousActEnvironment = actEnvironment.IS_REACT_ACT_ENVIRONMENT;
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  const root = hydrateRoot(host, <HydratedDialog />, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  try {
    await act(async () => {});
    expect(hydrationErrors).toEqual([]);
    expect(consoleError).not.toHaveBeenCalled();
    await expect
      .element(page.getByRole('dialog', { name: 'Hydrated dialog' }))
      .toBeVisible();
  } finally {
    await act(async () => root.unmount());
    consoleError.mockRestore();
    host.remove();
    if (previousActEnvironment === undefined) {
      delete actEnvironment.IS_REACT_ACT_ENVIRONMENT;
    } else {
      actEnvironment.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
    }
  }
});
