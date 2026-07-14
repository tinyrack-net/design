import './tooltip.css';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Tooltip, TooltipRoot } from './index.js';

test('uses Base UI tooltip semantics and positioning', async () => {
  expect(Tooltip.Root).toBe(TooltipRoot);
  await render(
    <Tooltip.Provider>
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger>Info</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup>
              Details
              <Tooltip.Arrow />
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>,
  );
  const popup = document.querySelector<HTMLElement>('.tr-tooltip-content');
  expect(popup?.hasAttribute('data-open')).toBe(true);
  expect(document.querySelector('.tr-tooltip')?.textContent).toBe('Info');
  expect(document.querySelector('.tr-tooltip-arrow')).not.toBeNull();
});

test('opens from focus, links its description, and dismisses with Escape', async () => {
  await render(
    <Tooltip.Provider closeDelay={0} delay={0}>
      <Tooltip.Root>
        <Tooltip.Trigger>Rack temperature</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup>24°C</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>,
  );

  const trigger = document.querySelector<HTMLElement>('.tr-tooltip');
  trigger?.focus();
  await expect
    .poll(() =>
      document.querySelector('.tr-tooltip-content')?.hasAttribute('data-open'),
    )
    .toBe(true);

  const popup = document.querySelector<HTMLElement>('.tr-tooltip-content');
  expect(popup?.getAttribute('role')).toBe('tooltip');
  expect(trigger?.getAttribute('aria-describedby')).toBe(popup?.id);
  expect(document.activeElement).toBe(trigger);

  await userEvent.keyboard('{Escape}');
  await expect
    .poll(
      () =>
        document.querySelector('.tr-tooltip-content')?.hasAttribute('data-open') ??
        false,
    )
    .toBe(false);
  expect(document.activeElement).toBe(trigger);
});

test('preserves explicit description ids, roles, and existing trigger descriptions', async () => {
  await render(
    <Tooltip.Provider>
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger aria-describedby="existing-description">Info</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup id="rack-details" role="status">
              Rack details
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>,
  );

  const trigger = document.querySelector<HTMLElement>('.tr-tooltip');
  const popup = document.querySelector<HTMLElement>('.tr-tooltip-content');
  expect(popup?.id).toBe('rack-details');
  expect(popup?.getAttribute('role')).toBe('status');
  expect(trigger?.getAttribute('aria-describedby')).toBe(
    'existing-description rack-details',
  );
});

test('opens and closes from real pointer hover while reporting controlled state', async () => {
  const onOpenChange = vi.fn();
  await render(
    <Tooltip.Provider closeDelay={0} delay={0}>
      <Tooltip.Root onOpenChange={onOpenChange}>
        <Tooltip.Trigger>Rack health</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner side="bottom">
            <Tooltip.Popup>Healthy</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>,
  );

  const trigger = document.querySelector<HTMLElement>('.tr-tooltip');
  await userEvent.hover(trigger as HTMLElement);
  await expect
    .poll(() =>
      document.querySelector('.tr-tooltip-content')?.hasAttribute('data-open'),
    )
    .toBe(true);
  expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(true);

  await userEvent.unhover(trigger as HTMLElement);
  await expect
    .poll(
      () =>
        document.querySelector('.tr-tooltip-content')?.hasAttribute('data-open') ??
        false,
    )
    .toBe(false);
  expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
});
