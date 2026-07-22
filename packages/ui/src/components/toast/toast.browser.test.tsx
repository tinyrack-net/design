import '../../core/core.css';
import './toast.css';
import { act, useEffect, useRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, expectTypeOf, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  createToastManager,
  TRToast,
  type TRToastManager,
  type TRToastManagerAddOptions,
  type TRToastObject,
  TRToastProvider,
  type TRUseToastManagerReturnValue,
  useToastManager,
} from './index.js';

test('exports typed manager inputs, objects, and hook results', () => {
  type Data = { rackId: string };
  expectTypeOf(createToastManager<Data>()).toEqualTypeOf<TRToastManager<Data>>();
  expectTypeOf<TRToastManagerAddOptions<Data>['data']>().toEqualTypeOf<
    Data | undefined
  >();
  expectTypeOf<TRUseToastManagerReturnValue<Data>['toasts']>().toEqualTypeOf<
    TRToastObject<Data>[]
  >();
});

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
    <TRToast.Portal>
      <TRToast.Viewport position="block-end-inline-end">
        {manager.toasts.map((toast) => (
          <TRToast.Root
            key={toast.id}
            toast={toast}
            variant={toast.title === 'Explicit' ? 'danger' : undefined}
          >
            <div>
              <TRToast.Title>{toast.title}</TRToast.Title>
              <TRToast.Description>{toast.description}</TRToast.Description>
            </div>
            <TRToast.Action>Undo</TRToast.Action>
            <TRToast.Close aria-label="Dismiss notification">×</TRToast.Close>
          </TRToast.Root>
        ))}
      </TRToast.Viewport>
    </TRToast.Portal>
  );
}

test('assembles Base UI toast management and parts', async () => {
  expect(TRToast.Provider).toBe(TRToastProvider);
  expect(typeof createToastManager().add).toBe('function');
  await render(
    <TRToast.Provider>
      <ToastExample />
    </TRToast.Provider>,
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
    12,
  );
  expect(Math.round(document.documentElement.clientHeight - viewportRect.bottom)).toBe(
    12,
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
  const toastRect = (
    closeButtons[0]?.closest('.tr-toast') as HTMLElement
  ).getBoundingClientRect();
  expect(Math.round(toastRect.right - closeRect.right)).toBe(8);
});

function ManagedToasts({ limit = 3 }: { limit?: number }) {
  const manager = useToastManager();

  return (
    <>
      <button
        type="button"
        onClick={() =>
          manager.add({
            actionProps: {
              children: 'Undo deployment',
            },
            description: 'Waiting for an action.',
            timeout: 0,
            title: `Toast ${manager.toasts.length + 1}`,
            type: 'custom-status',
          })
        }
      >
        Add toast
      </button>
      <output>{manager.toasts.map((toast) => toast.title).join(', ')}</output>
      <TRToast.Portal>
        <TRToast.Viewport aria-label="Managed notifications">
          {manager.toasts.map((toast) => (
            <TRToast.Root key={toast.id} toast={toast}>
              <TRToast.Content>
                <TRToast.Title />
                <TRToast.Description />
                <TRToast.Action />
                <TRToast.Close aria-label="Dismiss notification">×</TRToast.Close>
              </TRToast.Content>
            </TRToast.Root>
          ))}
        </TRToast.Viewport>
      </TRToast.Portal>
      <span data-limit={limit} />
    </>
  );
}

test('falls back unknown manager types to the neutral visual variant', async () => {
  await render(
    <TRToast.Provider timeout={0}>
      <ManagedToasts />
    </TRToast.Provider>,
  );

  await userEvent.click(document.querySelector('button') as HTMLButtonElement);
  const toast = document.querySelector<HTMLElement>('.tr-toast');
  await expect.poll(() => toast?.dataset['variant']).toBe('neutral');
  expect(toast?.dataset['type']).toBe('custom-status');
});

test('visually limits the queue and promotes the next toast after dismissal', async () => {
  await render(
    <TRToast.Provider limit={2} timeout={0}>
      <ManagedToasts limit={2} />
    </TRToast.Provider>,
  );
  const add = document.querySelector('button') as HTMLButtonElement;
  await userEvent.click(add);
  await userEvent.click(add);
  await userEvent.click(add);

  await expect.poll(() => document.querySelectorAll('.tr-toast').length).toBe(3);
  const limited = document.querySelector<HTMLElement>('.tr-toast[data-limited]');
  expect(limited).not.toBeNull();
  expect(getComputedStyle(limited as HTMLElement).display).toBe('none');

  const visibleClose = Array.from(
    document.querySelectorAll<HTMLButtonElement>(
      '.tr-toast:not([data-limited]) .tr-toast-close',
    ),
  )[0];
  await userEvent.click(visibleClose as HTMLButtonElement);
  await expect
    .poll(
      () =>
        Array.from(document.querySelectorAll<HTMLElement>('.tr-toast')).filter(
          (toast) => getComputedStyle(toast).display !== 'none',
        ).length,
    )
    .toBe(2);
});

test('uses distinct exit motion and removes a toast after close', async () => {
  await render(
    <TRToast.Provider timeout={0}>
      <ManagedToasts />
    </TRToast.Provider>,
  );
  await userEvent.click(document.querySelector('button') as HTMLButtonElement);
  const close = document.querySelector<HTMLButtonElement>('.tr-toast-close');
  await userEvent.click(close as HTMLButtonElement);
  const endingToast = document.querySelector<HTMLElement>('.tr-toast');

  expect(endingToast?.hasAttribute('data-ending-style')).toBe(true);
  expect(getComputedStyle(endingToast as HTMLElement).animationName).toBe(
    'tr-toast-exit',
  );
  await expect.poll(() => endingToast?.isConnected).toBe(false);
});

test('preserves action props, portal ownership, live-region semantics, and focus dismissal', async () => {
  const portalContainer = document.createElement('div');
  document.body.append(portalContainer);
  const action = vi.fn();

  function Fixture() {
    const manager = useToastManager();
    const added = useRef(false);
    useEffect(() => {
      if (added.current) return;
      added.current = true;
      manager.add({
        actionProps: { children: 'Undo deployment', onClick: action },
        description: 'Deployment completed.',
        timeout: 0,
        title: 'Success',
      });
    }, [manager]);
    return (
      <TRToast.Portal container={portalContainer}>
        <TRToast.Viewport aria-label="Deployment notifications">
          {manager.toasts.map((toast) => (
            <TRToast.Root key={toast.id} toast={toast}>
              <TRToast.Content>
                <TRToast.Title />
                <TRToast.Description />
                <TRToast.Action />
                <TRToast.Close aria-label="Dismiss notification">×</TRToast.Close>
              </TRToast.Content>
            </TRToast.Root>
          ))}
        </TRToast.Viewport>
      </TRToast.Portal>
    );
  }

  try {
    await render(
      <TRToast.Provider>
        <button type="button">Previous focus</button>
        <Fixture />
      </TRToast.Provider>,
    );
    const viewport = portalContainer.querySelector<HTMLElement>('.tr-toast-viewport');
    await expect.poll(() => viewport?.querySelector('.tr-toast')).not.toBeNull();
    expect(viewport?.role).toBe('region');
    expect(viewport?.getAttribute('aria-live')).toBe('polite');
    expect(viewport?.getAttribute('aria-relevant')).toBe('additions text');

    const actionButton = viewport?.querySelector<HTMLButtonElement>('.tr-toast-action');
    await userEvent.click(actionButton as HTMLButtonElement);
    expect(action).toHaveBeenCalledOnce();

    (viewport?.querySelector('.tr-toast') as HTMLElement).focus();
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => viewport?.querySelector('.tr-toast')).toBeNull();
  } finally {
    portalContainer.remove();
  }
});

test('server-renders and hydrates an empty provider and viewport without recovery', async () => {
  const fixture = (
    <TRToast.Provider>
      <TRToast.Portal>
        <TRToast.Viewport aria-label="Hydrated notifications" />
      </TRToast.Portal>
    </TRToast.Provider>
  );
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  expect(host.querySelector('.tr-toast-viewport')).toBeNull();
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
    await expect
      .poll(() => document.querySelector('[aria-label="Hydrated notifications"]'))
      .not.toBeNull();
  } finally {
    await act(async () => root.unmount());
    host.remove();
  }
});

test('integrates an external manager across add, update, promise, and close lifecycles', async () => {
  const manager = createToastManager();
  const onClose = vi.fn();
  const onRemove = vi.fn();

  function ExternalToasts() {
    const state = useToastManager();
    return (
      <TRToast.Portal>
        <TRToast.Viewport aria-label="External notifications">
          {state.toasts.map((toast) => (
            <TRToast.Root key={toast.id} toast={toast}>
              <TRToast.Content>
                <TRToast.Title />
                <TRToast.Description />
              </TRToast.Content>
              <TRToast.Close aria-label="Dismiss notification">×</TRToast.Close>
            </TRToast.Root>
          ))}
        </TRToast.Viewport>
      </TRToast.Portal>
    );
  }

  await render(
    <TRToast.Provider toastManager={manager} timeout={0}>
      <ExternalToasts />
    </TRToast.Provider>,
  );
  let id = '';
  await act(async () => {
    id = manager.add({
      description: 'Queued externally.',
      onClose,
      onRemove,
      title: 'External toast',
    });
  });
  await expect
    .poll(() => document.querySelector('.tr-toast-title')?.textContent)
    .toBe('External toast');

  await act(async () => manager.update(id, { title: 'External toast updated' }));
  await expect
    .poll(() => document.querySelector('.tr-toast-title')?.textContent)
    .toBe('External toast updated');

  let resolvePromise: ((value: string) => void) | undefined;
  const operation = new Promise<string>((resolve) => {
    resolvePromise = resolve;
  });
  let handledOperation: Promise<string> | undefined;
  await act(async () => {
    handledOperation = manager.promise(operation, {
      error: { title: 'Failed', type: 'danger' },
      loading: { title: 'Loading', type: 'info' },
      success: (value) => ({ title: value, type: 'success' }),
    });
  });
  await expect.poll(() => document.body.textContent).toContain('Loading');
  resolvePromise?.('Promise complete');
  await expect(handledOperation).resolves.toBe('Promise complete');
  await expect.poll(() => document.body.textContent).toContain('Promise complete');

  await act(async () => manager.close(id));
  expect(onClose).toHaveBeenCalledOnce();
  await expect.poll(() => onRemove).toHaveBeenCalledOnce();
  await act(async () => manager.close());
  await expect.poll(() => document.querySelector('.tr-toast')).toBeNull();
});

test('supports F6 focus entry, Escape dismissal, and focus restoration', async () => {
  await render(
    <TRToast.Provider timeout={0}>
      <button type="button">Work area</button>
      <ManagedToasts />
    </TRToast.Provider>,
  );
  const workArea = document.querySelector<HTMLButtonElement>('button');
  const add = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find(
    (button) => button.textContent === 'Add toast',
  );
  workArea?.focus();
  await userEvent.click(add as HTMLButtonElement);
  workArea?.focus();
  await userEvent.keyboard('{F6}');
  const viewport = document.querySelector<HTMLElement>('.tr-toast-viewport');
  expect(document.activeElement).toBe(viewport);
  await userEvent.keyboard('{Tab}');
  expect(document.activeElement?.classList.contains('tr-toast')).toBe(true);
  await userEvent.keyboard('{Escape}');
  await expect.poll(() => document.querySelector('.tr-toast')).toBeNull();
  await expect.poll(() => document.activeElement).toBe(workArea);
});

test('dismisses with a real rightward pointer swipe and animates in that direction', async () => {
  await render(
    <TRToast.Provider timeout={0}>
      <ManagedToasts />
    </TRToast.Provider>,
  );
  await userEvent.click(document.querySelector('button') as HTMLButtonElement);
  const toast = document.querySelector<HTMLElement>('.tr-toast');
  if (toast) toast.setPointerCapture = () => {};
  const dispatch = (
    type: string,
    clientX: number,
    movementX: number,
    buttons: number,
  ) =>
    toast?.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        buttons,
        cancelable: true,
        clientX,
        clientY: 20,
        movementX,
        pointerId: 7,
        pointerType: 'mouse',
      }),
    );
  dispatch('pointerdown', 20, 0, 1);
  dispatch('pointermove', 21, 1, 1);
  dispatch('pointermove', 100, 79, 1);
  dispatch('pointerup', 100, 0, 0);

  await expect.poll(() => toast?.dataset['swipeDirection']).toBe('right');
  expect(toast?.hasAttribute('data-ending-style')).toBe(true);
  expect(getComputedStyle(toast as HTMLElement).transform).not.toBe('none');
  await expect.poll(() => toast?.isConnected).toBe(false);
});

test.each([
  ['block-start-inline-start', 'start', 'start'],
  ['block-start-center', 'start', 'center'],
  ['block-start-inline-end', 'start', 'end'],
  ['block-end-inline-start', 'end', 'start'],
  ['block-end-center', 'end', 'center'],
  ['block-end-inline-end', 'end', 'end'],
] as const)('places the viewport at %s with logical insets', async (position, block, inline) => {
  const view = await render(
    <TRToast.Provider>
      <TRToast.Portal>
        <TRToast.Viewport
          aria-label={`${position} notifications`}
          position={position}
        />
      </TRToast.Portal>
    </TRToast.Provider>,
  );
  const viewport = document.querySelector<HTMLElement>('.tr-toast-viewport');
  await expect.poll(() => viewport).not.toBeNull();
  const rect = (viewport as HTMLElement).getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;
  expect(Math.round(block === 'start' ? rect.top : viewportHeight - rect.bottom)).toBe(
    12,
  );
  if (inline === 'center') {
    expect(Math.round(rect.left + rect.width / 2)).toBe(Math.round(viewportWidth / 2));
  } else {
    expect(
      Math.round(inline === 'start' ? rect.left : viewportWidth - rect.right),
    ).toBe(12);
  }
  await view.unmount();
});

test('positions an anchored toast with the complete viewport and arrow anatomy', async () => {
  function AnchoredFixture() {
    const manager = useToastManager();
    const anchorRef = useRef<HTMLButtonElement>(null);
    return (
      <>
        <button
          ref={anchorRef}
          type="button"
          onClick={() =>
            manager.add({
              description: 'Anchored status',
              positionerProps: { anchor: anchorRef.current, side: 'top' },
              timeout: 0,
            })
          }
        >
          Anchor
        </button>
        <TRToast.Portal>
          <TRToast.Viewport aria-label="Anchored notifications">
            {manager.toasts.map((toast) => (
              <TRToast.Positioner
                key={toast.id}
                toast={toast}
                {...toast.positionerProps}
              >
                <TRToast.Root toast={toast}>
                  <TRToast.Arrow />
                  <TRToast.Content>
                    <TRToast.Description />
                  </TRToast.Content>
                </TRToast.Root>
              </TRToast.Positioner>
            ))}
          </TRToast.Viewport>
        </TRToast.Portal>
      </>
    );
  }

  await render(
    <TRToast.Provider>
      <AnchoredFixture />
    </TRToast.Provider>,
  );
  await userEvent.click(document.querySelector('button') as HTMLButtonElement);
  const positioner = document.querySelector<HTMLElement>('.tr-toast-positioner');
  const arrow = document.querySelector<HTMLElement>('.tr-toast-arrow');
  await expect.poll(() => positioner?.dataset['side']).toMatch(/top|bottom/);
  expect(positioner).toHaveClass('tr-layer-positioner', 'tr-toast-positioner');
  expect(arrow).toHaveClass('tr-layer-arrow', 'tr-toast-arrow');
  expect(getComputedStyle(positioner as HTMLElement).position).toBe('absolute');
  expect(arrow?.dataset['side']).toBe(positioner?.dataset['side']);
});
