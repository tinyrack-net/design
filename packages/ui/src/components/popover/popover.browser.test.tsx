import './popover.css';
import { act, createRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, expectTypeOf, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  TRPopover,
  TRPopoverRoot,
  type TRPopoverRootProps,
  type TRPopoverTriggerProps,
} from './index.js';

test('preserves handle payload types across the root and trigger contract', () => {
  type Payload = { rack: string };

  expectTypeOf<TRPopoverRootProps<Payload>['handle']>().toEqualTypeOf<
    ReturnType<typeof TRPopover.createHandle<Payload>> | undefined
  >();
  expectTypeOf<TRPopoverTriggerProps<Payload>['payload']>().toEqualTypeOf<
    Payload | undefined
  >();
});

function DetailsPopover({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  return (
    <TRPopover.Root onOpenChange={onOpenChange}>
      <TRPopover.Trigger>Details</TRPopover.Trigger>
      <TRPopover.Portal>
        <TRPopover.Positioner>
          <TRPopover.Popup>
            <TRPopover.Title>Server status</TRPopover.Title>
            <TRPopover.Description>Rack Alpha is online.</TRPopover.Description>
            <TRPopover.Close>Close details</TRPopover.Close>
          </TRPopover.Popup>
        </TRPopover.Positioner>
      </TRPopover.Portal>
    </TRPopover.Root>
  );
}

test('opens by pointer with accessible title and description relationships', async () => {
  expect(TRPopover.Root).toBe(TRPopoverRoot);
  const onOpenChange = vi.fn();
  await render(<DetailsPopover onOpenChange={onOpenChange} />);
  const trigger = page.getByRole('button', { name: 'Details' }).element();
  await userEvent.click(trigger);

  const popup = page.getByRole('dialog', { name: 'Server status' }).element();
  expect(popup).toHaveClass('tr-layer', 'tr-popover-popup');
  expect(popup.getAttribute('aria-labelledby')).toBeTruthy();
  expect(popup.getAttribute('aria-describedby')).toBeTruthy();
  expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(true);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
});

test('connects detached triggers through a typed handle and forwards part props and refs', async () => {
  const handle = TRPopover.createHandle<{ rack: string }>();
  const triggerRef = createRef<HTMLButtonElement>();
  const popupRef = createRef<HTMLDivElement>();

  await render(
    <>
      <TRPopover.Trigger
        className="consumer-trigger"
        handle={handle}
        payload={{ rack: 'Rack Delta' }}
        ref={triggerRef}
      >
        Detached details
      </TRPopover.Trigger>
      <TRPopover.Root handle={handle}>
        {({ payload }) => (
          <TRPopover.Portal>
            <TRPopover.Positioner align="start" side="right" sideOffset={12}>
              <TRPopover.Popup className="consumer-popup" ref={popupRef}>
                <TRPopover.Title>{payload?.rack}</TRPopover.Title>
                <TRPopover.Close>Close detached details</TRPopover.Close>
              </TRPopover.Popup>
            </TRPopover.Positioner>
          </TRPopover.Portal>
        )}
      </TRPopover.Root>
    </>,
  );

  expect(triggerRef.current).toHaveClass('tr-popover-trigger', 'consumer-trigger');
  await userEvent.click(triggerRef.current as HTMLButtonElement);
  await expect.element(page.getByRole('dialog', { name: 'Rack Delta' })).toBeVisible();
  expect(popupRef.current).toHaveClass(
    'tr-layer',
    'tr-popover-popup',
    'consumer-popup',
  );
  expect(document.body.contains(popupRef.current)).toBe(true);
  await userEvent.click(
    page.getByRole('button', { name: 'Close detached details' }).element(),
  );
  await expect.element(triggerRef.current as HTMLButtonElement).toHaveFocus();
});

test('dismisses with Escape and restores trigger focus', async () => {
  const screen = await render(<DetailsPopover />);
  const trigger = screen.getByRole('button', { exact: true, name: 'Details' });
  await userEvent.type(trigger, '{Enter}');
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect
    .element(page.getByRole('button', { name: 'Close details' }))
    .toHaveFocus();
  await userEvent.keyboard('{Escape}');
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect.element(trigger).toHaveFocus();
});

test('preserves a custom portal host, viewport, backdrop, positioning state, and token styles', async () => {
  const portalContainer = document.createElement('section');
  const viewportRef = createRef<HTMLDivElement>();
  for (const [token, value] of Object.entries({
    '--tinyrack-border-width-default': '1px',
    '--tinyrack-control-border': 'rgb(67, 89, 101)',
    '--tinyrack-duration-normal': '150ms',
    '--tinyrack-ease-out': 'ease-out',
    '--tinyrack-overlay-closed-scale': '0.96',
    '--tinyrack-radius-lg': '12px',
    '--tinyrack-shadow-raised': '0 4px 12px rgb(0 0 0 / 0.2)',
    '--tinyrack-space-lg': '24px',
    '--tinyrack-space-md': '16px',
    '--tinyrack-space-sm': '8px',
    '--tinyrack-surface': 'rgb(12, 34, 56)',
    '--tinyrack-text': 'rgb(250, 250, 250)',
  })) {
    portalContainer.style.setProperty(token, value);
  }
  document.body.append(portalContainer);

  try {
    await render(
      <div style={{ insetInlineEnd: 0, position: 'fixed', top: '50%' }}>
        <TRPopover.Root defaultOpen modal>
          <TRPopover.Trigger>Hosted details</TRPopover.Trigger>
          <TRPopover.Portal container={portalContainer}>
            <TRPopover.Backdrop />
            <TRPopover.Positioner
              align="end"
              alignOffset={12}
              collisionAvoidance={{ align: 'shift', side: 'flip' }}
              side="right"
              sideOffset={16}
            >
              <TRPopover.Popup>
                <TRPopover.Arrow />
                <TRPopover.Viewport ref={viewportRef}>
                  <TRPopover.Title>Hosted status</TRPopover.Title>
                  <TRPopover.Description>
                    Collision-aware hosted content.
                  </TRPopover.Description>
                  <TRPopover.Close>Close hosted details</TRPopover.Close>
                </TRPopover.Viewport>
              </TRPopover.Popup>
            </TRPopover.Positioner>
          </TRPopover.Portal>
        </TRPopover.Root>
      </div>,
    );

    const popup = portalContainer.querySelector<HTMLElement>('.tr-popover-popup');
    const positioner = portalContainer.querySelector<HTMLElement>(
      '.tr-popover-positioner',
    );
    const arrow = portalContainer.querySelector<HTMLElement>('.tr-popover-arrow');
    const backdrop = portalContainer.querySelector<HTMLElement>('.tr-popover-backdrop');
    expect(popup).not.toBeNull();
    expect(positioner).toHaveClass('tr-layer-positioner', 'tr-popover-positioner');
    expect(positioner?.dataset['align']).toBe('end');
    expect(['top', 'right', 'bottom', 'left']).toContain(positioner?.dataset['side']);
    expect(backdrop).toHaveClass('tr-layer-backdrop', 'tr-popover-backdrop');
    expect(viewportRef.current).toHaveClass('tr-layer-viewport', 'tr-popover-viewport');
    expect(arrow?.dataset['side']).toBe(positioner?.dataset['side']);

    const bounds = (popup as HTMLElement).getBoundingClientRect();
    expect(bounds.left).toBeGreaterThanOrEqual(0);
    expect(bounds.right).toBeLessThanOrEqual(window.innerWidth);
    const popupStyle = getComputedStyle(popup as HTMLElement);
    expect(popupStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(popupStyle.borderTopWidth).not.toBe('0px');
    expect(popupStyle.borderRadius).not.toBe('0px');
    expect(popupStyle.boxShadow).not.toBe('none');
    expect(popupStyle.transitionProperty).toContain('opacity');
  } finally {
    portalContainer.remove();
  }
});

test('dismisses on outside pointer interaction and remains within viewport bounds', async () => {
  await render(
    <>
      <DetailsPopover />
      <button type="button">Outside action</button>
    </>,
  );
  const trigger = page.getByRole('button', { name: 'Details' }).element();
  await userEvent.click(trigger);
  const popup = page.getByRole('dialog', { name: 'Server status' }).element();
  const rect = popup.getBoundingClientRect();
  expect(rect.left).toBeGreaterThanOrEqual(0);
  expect(rect.right).toBeLessThanOrEqual(window.innerWidth);
  await userEvent.click(page.getByRole('button', { name: 'Outside action' }).element());
  await expect.poll(() => trigger.getAttribute('aria-expanded')).toBe('false');
});

test('keeps controlled open state synchronized with the close action', async () => {
  function ControlledPopover() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <TRPopover.Root onOpenChange={setOpen} open={open}>
          <TRPopover.Trigger>Controlled details</TRPopover.Trigger>
          <TRPopover.Portal>
            <TRPopover.Positioner>
              <TRPopover.Popup>
                <TRPopover.Title>Controlled status</TRPopover.Title>
                <TRPopover.Close>Done</TRPopover.Close>
              </TRPopover.Popup>
            </TRPopover.Positioner>
          </TRPopover.Portal>
        </TRPopover.Root>
        <output>{open ? 'open' : 'closed'}</output>
      </>
    );
  }

  await render(<ControlledPopover />);
  await userEvent.click(
    page.getByRole('button', { name: 'Controlled details' }).element(),
  );
  await expect.poll(() => document.querySelector('output')?.textContent).toBe('open');
  await userEvent.click(page.getByRole('button', { name: 'Done' }).element());
  await expect.poll(() => document.querySelector('output')?.textContent).toBe('closed');
});

function HydratedPopoverFixture() {
  return (
    <TRPopover.Root defaultOpen>
      <TRPopover.Trigger>Hydrated trigger</TRPopover.Trigger>
      <TRPopover.Portal>
        <TRPopover.Positioner>
          <TRPopover.Popup>
            <TRPopover.Title>Hydrated details</TRPopover.Title>
            <TRPopover.Close>Close hydrated details</TRPopover.Close>
          </TRPopover.Popup>
        </TRPopover.Positioner>
      </TRPopover.Portal>
    </TRPopover.Root>
  );
}

test('server-renders and hydrates a default-open portaled popover', async () => {
  const actEnvironment = globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  };
  const previousActEnvironment = actEnvironment.IS_REACT_ACT_ENVIRONMENT;
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement('div');
  host.innerHTML = renderToString(<HydratedPopoverFixture />);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, <HydratedPopoverFixture />, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  try {
    await act(async () => {});
    expect(hydrationErrors).toEqual([]);
    await expect
      .poll(() =>
        Array.from(document.querySelectorAll('.tr-popover-popup')).some(
          (popup) =>
            popup.textContent?.includes('Hydrated details') &&
            popup.hasAttribute('data-open'),
        ),
      )
      .toBe(true);
  } finally {
    await act(async () => root.unmount());
    host.remove();
    if (previousActEnvironment === undefined) {
      delete actEnvironment.IS_REACT_ACT_ENVIRONMENT;
    } else {
      actEnvironment.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
    }
  }
});
