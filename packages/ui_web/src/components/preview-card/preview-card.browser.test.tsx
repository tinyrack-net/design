import '../../core/core.css';
import './preview-card.css';
import { act, type CSSProperties, createRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { createPreviewCardHandle, TRPreviewCard, TRPreviewCardRoot } from './index.js';

function ControlledPreviewCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TRPreviewCard.Root onOpenChange={setOpen} open={open}>
        <TRPreviewCard.Trigger closeDelay={0} delay={0} href="#controlled">
          Controlled preview
        </TRPreviewCard.Trigger>
        <TRPreviewCard.Portal>
          <TRPreviewCard.Positioner>
            <TRPreviewCard.Popup>Controlled details</TRPreviewCard.Popup>
          </TRPreviewCard.Positioner>
        </TRPreviewCard.Portal>
      </TRPreviewCard.Root>
      <output>{open ? 'open' : 'closed'}</output>
    </>
  );
}

function HydratedPreviewCard() {
  return (
    <TRPreviewCard.Root defaultOpen>
      <TRPreviewCard.Trigger href="#hydrated">Hydrated preview</TRPreviewCard.Trigger>
      <TRPreviewCard.Portal>
        <TRPreviewCard.Positioner>
          <TRPreviewCard.Popup>
            Hydrated details
            <TRPreviewCard.Arrow />
          </TRPreviewCard.Popup>
        </TRPreviewCard.Positioner>
      </TRPreviewCard.Portal>
    </TRPreviewCard.Root>
  );
}

test('creates detached handles through both public exports', () => {
  expect(createPreviewCardHandle()).toBeTypeOf('object');
  expect(TRPreviewCard.createHandle()).toBeTypeOf('object');
});

test('renders the Tinyrack TRPreviewCard wrapper', async () => {
  expect(TRPreviewCard.Root).toBe(TRPreviewCardRoot);
  await render(
    <TRPreviewCard.Root>
      <TRPreviewCard.Trigger href="#preview">Preview</TRPreviewCard.Trigger>
    </TRPreviewCard.Root>,
  );
  expect(document.querySelector('.tr-preview-card-trigger')).not.toBeNull();
  expect(document.querySelector('.tr-preview-card')).toBeNull();
});

test('applies the visual contract to rendered trigger and popup parts', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <TRPreviewCard.Root defaultOpen>
      <TRPreviewCard.Trigger href="#parts">Rendered trigger</TRPreviewCard.Trigger>
      <TRPreviewCard.Portal>
        <TRPreviewCard.Positioner>
          <TRPreviewCard.Popup>Rendered popup</TRPreviewCard.Popup>
        </TRPreviewCard.Positioner>
      </TRPreviewCard.Portal>
    </TRPreviewCard.Root>,
  );
  const trigger = document.querySelector<HTMLElement>('.tr-preview-card-trigger');
  const popup = document.querySelector<HTMLElement>('.tr-preview-card-popup');
  await expect.poll(() => popup?.hasAttribute('data-open')).toBe(true);
  expect(popup).toHaveClass('tr-layer');
  expect(getComputedStyle(trigger as HTMLElement).fontFamily).not.toBe('');
  expect(getComputedStyle(popup as HTMLElement).maxWidth).not.toBe('none');
  delete document.documentElement.dataset['theme'];
});

test('preserves refs, render, native props, events, classes, and style overrides', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  const onClick = vi.fn();
  const triggerRef = createRef<HTMLAnchorElement>();
  const popupRef = createRef<HTMLDivElement>();
  const styles = {
    '--tr-preview-card-popup-background': 'rgb(12 34 56)',
    '--tr-preview-card-popup-max-width': '10rem',
  } as CSSProperties;

  await render(
    <TRPreviewCard.Root defaultOpen>
      <TRPreviewCard.Trigger
        className="consumer-trigger"
        data-consumer-trigger="preserved"
        href="#rendered"
        onClick={onClick}
        ref={triggerRef}
        render={<a href="#rendered" />}
      >
        Rendered preview
      </TRPreviewCard.Trigger>
      <TRPreviewCard.Portal>
        <TRPreviewCard.Positioner>
          <TRPreviewCard.Popup
            className="consumer-popup"
            data-consumer-popup="preserved"
            ref={popupRef}
            style={styles}
          >
            Styled details
            <TRPreviewCard.Arrow />
          </TRPreviewCard.Popup>
        </TRPreviewCard.Positioner>
      </TRPreviewCard.Portal>
    </TRPreviewCard.Root>,
  );

  const arrow = document.querySelector<HTMLElement>('.tr-preview-card-arrow');
  await expect.poll(() => popupRef.current?.hasAttribute('data-open')).toBe(true);
  expect(triggerRef.current).toHaveClass('tr-preview-card-trigger', 'consumer-trigger');
  expect(triggerRef.current?.dataset['consumerTrigger']).toBe('preserved');
  expect(popupRef.current).toHaveClass(
    'tr-layer',
    'tr-preview-card-popup',
    'consumer-popup',
  );
  expect(popupRef.current?.dataset['consumerPopup']).toBe('preserved');
  expect(getComputedStyle(popupRef.current as HTMLDivElement).backgroundColor).toBe(
    'rgb(12, 34, 56)',
  );
  expect(getComputedStyle(arrow as HTMLElement).backgroundColor).toBe(
    'rgb(12, 34, 56)',
  );
  expect(popupRef.current?.getBoundingClientRect().width).toBeLessThanOrEqual(160);

  history.replaceState(null, '', location.pathname);
  await userEvent.click(triggerRef.current as HTMLAnchorElement);
  expect(onClick).toHaveBeenCalledOnce();
  delete document.documentElement.dataset['theme'];
});

test('renders every auxiliary part in a custom portal container', async () => {
  const portalContainer = document.createElement('div');
  document.body.append(portalContainer);

  const view = await render(
    <TRPreviewCard.Root defaultOpen>
      <TRPreviewCard.Trigger href="#parts">All parts</TRPreviewCard.Trigger>
      <TRPreviewCard.Portal container={portalContainer}>
        <TRPreviewCard.Backdrop />
        <TRPreviewCard.Positioner>
          <TRPreviewCard.Popup>
            <TRPreviewCard.Arrow />
            <TRPreviewCard.Viewport>Viewport details</TRPreviewCard.Viewport>
          </TRPreviewCard.Popup>
        </TRPreviewCard.Positioner>
      </TRPreviewCard.Portal>
    </TRPreviewCard.Root>,
  );

  await expect
    .poll(() => portalContainer.querySelector('.tr-preview-card-popup[data-open]'))
    .not.toBeNull();
  expect(portalContainer.querySelector('.tr-preview-card-portal')).not.toBeNull();
  expect(portalContainer.querySelector('.tr-preview-card-backdrop')).not.toBeNull();
  expect(portalContainer.querySelector('.tr-preview-card-positioner')).not.toBeNull();
  expect(portalContainer.querySelector('.tr-preview-card-arrow')).not.toBeNull();
  expect(portalContainer.querySelector('.tr-preview-card-viewport')).not.toBeNull();

  await view.unmount();
  portalContainer.remove();
});

test('opens from keyboard focus and dismisses without moving focus', async () => {
  const onOpenChange = vi.fn();

  await render(
    <TRPreviewCard.Root onOpenChange={onOpenChange}>
      <TRPreviewCard.Trigger delay={0} href="#rack-alpha">
        Rack Alpha
      </TRPreviewCard.Trigger>
      <TRPreviewCard.Portal>
        <TRPreviewCard.Positioner>
          <TRPreviewCard.Popup>
            <strong>Rack Alpha</strong>
            <p>Healthy · 12 services</p>
          </TRPreviewCard.Popup>
        </TRPreviewCard.Positioner>
      </TRPreviewCard.Portal>
    </TRPreviewCard.Root>,
  );

  const trigger = document.querySelector<HTMLAnchorElement>('.tr-preview-card-trigger');
  trigger?.focus();
  await expect
    .poll(
      () => document.querySelector('.tr-preview-card-popup')?.hasAttribute('data-open'),
      { timeout: 2_000 },
    )
    .toBe(true);

  const popup = document.querySelector<HTMLElement>('.tr-preview-card-popup');
  expect(popup?.textContent).toContain('Healthy · 12 services');
  expect(document.activeElement).toBe(trigger);
  expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(true);

  history.replaceState(null, '', location.pathname);
  await userEvent.click(trigger as HTMLAnchorElement);
  expect(location.hash).toBe('#rack-alpha');

  await userEvent.keyboard('{Escape}');
  await expect.poll(() => popup?.hasAttribute('data-open')).toBe(false);
  expect(document.activeElement).toBe(trigger);
  expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
});

test('opens and closes from pointer hover with the configured delays', async () => {
  await render(
    <TRPreviewCard.Root>
      <TRPreviewCard.Trigger closeDelay={0} delay={0} href="#rack-beta">
        Rack Beta
      </TRPreviewCard.Trigger>
      <TRPreviewCard.Portal>
        <TRPreviewCard.Positioner>
          <TRPreviewCard.Popup>Rack Beta health</TRPreviewCard.Popup>
        </TRPreviewCard.Positioner>
      </TRPreviewCard.Portal>
    </TRPreviewCard.Root>,
  );

  const trigger = document.querySelector<HTMLAnchorElement>('.tr-preview-card-trigger');
  await userEvent.hover(trigger as HTMLAnchorElement);
  await expect
    .poll(
      () => document.querySelector('.tr-preview-card-popup')?.hasAttribute('data-open'),
      { timeout: 2_000 },
    )
    .toBe(true);

  await userEvent.unhover(trigger as HTMLAnchorElement);
  await expect
    .poll(
      () => document.querySelector('.tr-preview-card-popup')?.hasAttribute('data-open'),
      { timeout: 2_000 },
    )
    .not.toBe(true);
});

test('keeps controlled open state synchronized with hover dismissal', async () => {
  await render(<ControlledPreviewCard />);
  const trigger = document.querySelector<HTMLAnchorElement>('.tr-preview-card-trigger');
  const output = document.querySelector<HTMLOutputElement>('output');

  expect(output?.textContent).toBe('closed');
  await userEvent.hover(trigger as HTMLAnchorElement);
  await expect.poll(() => output?.textContent).toBe('open');
  await userEvent.unhover(trigger as HTMLAnchorElement);
  await expect.poll(() => output?.textContent).toBe('closed');
});

test('contains long preview content inside the viewport', async () => {
  await render(
    <div style={{ insetInlineEnd: 0, position: 'fixed', top: '50%' }}>
      <TRPreviewCard.Root defaultOpen>
        <TRPreviewCard.Trigger href="#collision">
          Collision preview
        </TRPreviewCard.Trigger>
        <TRPreviewCard.Portal>
          <TRPreviewCard.Positioner align="end" side="right">
            <TRPreviewCard.Popup>
              MaintenanceWindowRequiresOperatorConfirmationBeforeRestartingServices
            </TRPreviewCard.Popup>
          </TRPreviewCard.Positioner>
        </TRPreviewCard.Portal>
      </TRPreviewCard.Root>
    </div>,
  );

  const popup = document.querySelector<HTMLElement>('.tr-preview-card-popup');
  await expect.poll(() => popup?.hasAttribute('data-open')).toBe(true);
  const bounds = (popup as HTMLElement).getBoundingClientRect();
  expect(bounds.left).toBeGreaterThanOrEqual(0);
  expect(bounds.right).toBeLessThanOrEqual(window.innerWidth);
  expect((popup as HTMLElement).scrollWidth).toBeLessThanOrEqual(
    (popup as HTMLElement).clientWidth,
  );
});

test('server-renders and hydrates a default-open portaled preview card', async () => {
  const actEnvironment = globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  };
  const previousActEnvironment = actEnvironment.IS_REACT_ACT_ENVIRONMENT;
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement('div');
  host.innerHTML = renderToString(<HydratedPreviewCard />);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, <HydratedPreviewCard />, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  try {
    await act(async () => {});
    expect(hydrationErrors).toEqual([]);
    await expect
      .poll(() =>
        Array.from(document.querySelectorAll('.tr-preview-card-popup')).some(
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
