import '../../core/core.css';
import './context-menu.css';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRContextMenu, TRContextMenuRoot } from './index.js';

test('renders the Tinyrack TRContextMenu wrapper', async () => {
  expect(TRContextMenu.Root).toBe(TRContextMenuRoot);
  await render(
    <TRContextMenu.Root>
      <TRContextMenu.Trigger>Target</TRContextMenu.Trigger>
    </TRContextMenu.Root>,
  );
  expect(document.querySelector('.tr-context-menu-trigger')).not.toBeNull();
});

test('opens from the real context event instead of a forced open coordinate', async () => {
  await render(
    <TRContextMenu.Root>
      <TRContextMenu.Trigger>Rack target</TRContextMenu.Trigger>
      <TRContextMenu.Portal>
        <TRContextMenu.Backdrop />
        <TRContextMenu.Positioner>
          <TRContextMenu.Popup>
            <TRContextMenu.Arrow />
            <TRContextMenu.Item>Inspect</TRContextMenu.Item>
          </TRContextMenu.Popup>
        </TRContextMenu.Positioner>
      </TRContextMenu.Portal>
    </TRContextMenu.Root>,
  );

  document.querySelector('.tr-context-menu-trigger')?.dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      button: 2,
      clientX: 120,
      clientY: 80,
    }),
  );

  await expect
    .poll(() => document.querySelector('.tr-context-menu-popup')?.getAttribute('role'))
    .toBe('menu');
  const positioner = document.querySelector<HTMLElement>('.tr-context-menu-positioner');
  await expect.poll(() => positioner?.style.transform).not.toBe('');
});

test('opens from Shift+F10 when the target is keyboard focusable', async () => {
  await render(
    <TRContextMenu.Root>
      <TRContextMenu.Trigger render={<button type="button" />}>
        Keyboard target
      </TRContextMenu.Trigger>
      <TRContextMenu.Portal>
        <TRContextMenu.Positioner>
          <TRContextMenu.Popup>
            <TRContextMenu.Item>Inspect</TRContextMenu.Item>
          </TRContextMenu.Popup>
        </TRContextMenu.Positioner>
      </TRContextMenu.Portal>
    </TRContextMenu.Root>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('.tr-context-menu-trigger');
  trigger?.focus();
  await userEvent.keyboard('{Shift>}{F10}{/Shift}');

  await expect.poll(() => document.querySelector('[role="menu"]')).not.toBeNull();
});

test('supports the TRContextMenu key and preserves consumer keyboard cancellation', async () => {
  const onKeyDown = vi.fn();
  await render(
    <TRContextMenu.Root>
      <TRContextMenu.Trigger
        onKeyDown={(event) => {
          onKeyDown(event.key);
          if (event.key === 'F10') event.preventDefault();
        }}
        render={<button type="button" />}
      >
        Keyboard target
      </TRContextMenu.Trigger>
      <TRContextMenu.Portal>
        <TRContextMenu.Positioner>
          <TRContextMenu.Popup>
            <TRContextMenu.Item>Inspect</TRContextMenu.Item>
          </TRContextMenu.Popup>
        </TRContextMenu.Positioner>
      </TRContextMenu.Portal>
    </TRContextMenu.Root>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('.tr-context-menu-trigger');
  trigger?.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, key: 'F10', shiftKey: true }),
  );
  expect(document.querySelector('[role="menu"]')).toBeNull();

  trigger?.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, key: 'TRContextMenu' }),
  );
  await expect.poll(() => document.querySelector('[role="menu"]')).not.toBeNull();
  expect(onKeyDown).toHaveBeenCalledTimes(2);
});

test('preserves positioner overrides, nested positioning, and capture cancellation', async () => {
  const style = vi.fn(() => ({ opacity: 1 }));
  const anchor = {
    getBoundingClientRect: () =>
      DOMRect.fromRect({ height: 0, width: 0, x: 24, y: 24 }),
  };
  const onContextMenuCapture = vi.fn((event: ReactMouseEvent) => {
    if (event.currentTarget.textContent === 'Cancelled target') event.preventDefault();
  });
  await render(
    <>
      <TRContextMenu.Root>
        <TRContextMenu.Trigger
          onContextMenuCapture={onContextMenuCapture}
          render={<button type="button" />}
        >
          Cancelled target
        </TRContextMenu.Trigger>
      </TRContextMenu.Root>
      <TRContextMenu.Root>
        <TRContextMenu.Trigger render={<button type="button" />}>
          Rack target
        </TRContextMenu.Trigger>
        <TRContextMenu.Portal>
          <TRContextMenu.Positioner anchor={anchor} style={style}>
            <TRContextMenu.Popup>
              <TRContextMenu.SubmenuRoot>
                <TRContextMenu.SubmenuTrigger>Move to</TRContextMenu.SubmenuTrigger>
                <TRContextMenu.Portal keepMounted>
                  <TRContextMenu.Positioner>
                    <TRContextMenu.Popup>
                      <TRContextMenu.Item>Production</TRContextMenu.Item>
                    </TRContextMenu.Popup>
                  </TRContextMenu.Positioner>
                </TRContextMenu.Portal>
              </TRContextMenu.SubmenuRoot>
            </TRContextMenu.Popup>
          </TRContextMenu.Positioner>
        </TRContextMenu.Portal>
      </TRContextMenu.Root>
    </>,
  );

  const cancelled = document.querySelectorAll<HTMLButtonElement>(
    '.tr-context-menu-trigger',
  )[0];
  cancelled?.dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      button: 2,
      clientX: 12,
      clientY: 12,
    }),
  );
  expect(document.querySelector('[role="menu"]')).toBeNull();

  const target = document.querySelectorAll<HTMLButtonElement>(
    '.tr-context-menu-trigger',
  )[1];
  target?.dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      button: 2,
      clientX: 96,
      clientY: 72,
    }),
  );
  await expect.poll(() => document.querySelector('[role="menu"]')).not.toBeNull();
  expect(style).toHaveBeenCalled();
  expect(onContextMenuCapture).toHaveBeenCalledOnce();
  const positioners = document.querySelectorAll('.tr-context-menu-positioner');
  expect(positioners.length).toBe(2);
  expect(positioners[0]?.getAttribute('data-context-point')).toBe('96,72');
  expect(positioners[1]?.hasAttribute('data-context-point')).toBe(false);
});

test('styles items, submenu triggers, indicators, separators, and overflow as menu anatomy', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <TRContextMenu.Root>
      <TRContextMenu.Trigger>Rack target</TRContextMenu.Trigger>
      <TRContextMenu.Portal>
        <TRContextMenu.Backdrop />
        <TRContextMenu.Positioner>
          <TRContextMenu.Popup>
            <TRContextMenu.Arrow />
            <TRContextMenu.Group>
              <TRContextMenu.GroupLabel>View</TRContextMenu.GroupLabel>
              <TRContextMenu.CheckboxItem defaultChecked>
                <TRContextMenu.CheckboxItemIndicator>
                  Checked
                </TRContextMenu.CheckboxItemIndicator>
                Show labels
              </TRContextMenu.CheckboxItem>
              <TRContextMenu.Item disabled>Unavailable</TRContextMenu.Item>
            </TRContextMenu.Group>
            <TRContextMenu.Separator />
            <TRContextMenu.SubmenuRoot>
              <TRContextMenu.SubmenuTrigger>Move to</TRContextMenu.SubmenuTrigger>
              <TRContextMenu.Portal>
                <TRContextMenu.Positioner>
                  <TRContextMenu.Popup>
                    <TRContextMenu.Item>Production</TRContextMenu.Item>
                  </TRContextMenu.Popup>
                </TRContextMenu.Positioner>
              </TRContextMenu.Portal>
            </TRContextMenu.SubmenuRoot>
            <TRContextMenu.Item variant="danger">Remove rack</TRContextMenu.Item>
          </TRContextMenu.Popup>
        </TRContextMenu.Positioner>
      </TRContextMenu.Portal>
    </TRContextMenu.Root>,
  );

  document.querySelector('.tr-context-menu-trigger')?.dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      button: 2,
      clientX: 48,
      clientY: 48,
    }),
  );
  await expect.poll(() => document.querySelector('[role="menu"]')).not.toBeNull();

  const popup = document.querySelector<HTMLElement>('.tr-context-menu-popup');
  const item = document.querySelector<HTMLElement>('.tr-context-menu-checkbox-item');
  const submenu = document.querySelector<HTMLElement>(
    '.tr-context-menu-submenu-trigger',
  );
  const separator = document.querySelector<HTMLElement>('.tr-context-menu-separator');
  const indicator = document.querySelector<HTMLElement>(
    '.tr-context-menu-checkbox-item-indicator',
  );
  const disabledItem = document.querySelector<HTMLElement>(
    '.tr-context-menu-item[data-disabled]',
  );
  const dangerItem = document.querySelector<HTMLElement>('[data-variant="danger"]');

  expect(getComputedStyle(popup as HTMLElement).display).toBe('grid');
  expect(getComputedStyle(popup as HTMLElement).overflowY).toBe('auto');
  expect(getComputedStyle(submenu as HTMLElement).display).toBe(
    getComputedStyle(item as HTMLElement).display,
  );
  expect(getComputedStyle(submenu as HTMLElement).width).toBe(
    getComputedStyle(item as HTMLElement).width,
  );
  expect(getComputedStyle(submenu as HTMLElement).borderTopStyle).toBe('none');
  expect(
    Number.parseFloat(getComputedStyle(separator as HTMLElement).height),
  ).toBeGreaterThan(0);
  expect(getComputedStyle(indicator as HTMLElement).display).toContain('flex');
  expect(
    Number.parseFloat(getComputedStyle(indicator as HTMLElement).width),
  ).toBeGreaterThan(0);
  expect(
    Number.parseFloat(getComputedStyle(disabledItem as HTMLElement).opacity),
  ).toBeLessThan(1);
  expect(getComputedStyle(dangerItem as HTMLElement).color).not.toBe(
    getComputedStyle(item as HTMLElement).color,
  );
  expect(document.querySelector('.tr-context-menu-arrow')).not.toBeNull();
  expect(document.querySelector('.tr-context-menu-backdrop')).not.toBeNull();
  item?.setAttribute('data-highlighted', '');
  expect(getComputedStyle(item as HTMLElement).backgroundColor).not.toBe(
    getComputedStyle(popup as HTMLElement).backgroundColor,
  );
  delete document.documentElement.dataset['theme'];
});

test('invokes an enabled command and restores trigger focus', async () => {
  const onClick = vi.fn();
  await render(
    <TRContextMenu.Root>
      <TRContextMenu.Trigger render={<button type="button" />}>
        Rack target
      </TRContextMenu.Trigger>
      <TRContextMenu.Portal>
        <TRContextMenu.Backdrop />
        <TRContextMenu.Positioner>
          <TRContextMenu.Popup>
            <TRContextMenu.Item disabled>Unavailable</TRContextMenu.Item>
            <TRContextMenu.Item onClick={onClick}>Inspect rack</TRContextMenu.Item>
          </TRContextMenu.Popup>
        </TRContextMenu.Positioner>
      </TRContextMenu.Portal>
    </TRContextMenu.Root>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('.tr-context-menu-trigger');
  trigger?.focus();
  trigger?.dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      button: 2,
      clientX: 32,
      clientY: 32,
    }),
  );
  await expect.poll(() => document.querySelector('[role="menu"]')).not.toBeNull();
  const disabledItem = Array.from(
    document.querySelectorAll<HTMLElement>('[role="menuitem"]'),
  ).find((item) => item.textContent === 'Unavailable');
  const inspectItem = Array.from(
    document.querySelectorAll<HTMLElement>('[role="menuitem"]'),
  ).find((item) => item.textContent === 'Inspect rack');
  expect(disabledItem?.getAttribute('aria-disabled')).toBe('true');
  await userEvent.click(inspectItem as HTMLElement);
  await expect.poll(() => onClick.mock.calls.length).toBe(1);
  await expect.poll(() => document.activeElement).toBe(trigger);
});

test('21-22 keeps the backdrop transparent and anchors the popup to pointer coordinates', async () => {
  await render(
    <TRContextMenu.Root>
      <TRContextMenu.Trigger style={{ height: 160, width: 320 }}>
        Rack canvas
      </TRContextMenu.Trigger>
      <TRContextMenu.Portal>
        <TRContextMenu.Backdrop />
        <TRContextMenu.Positioner>
          <TRContextMenu.Popup style={{ minWidth: 120, width: 120 }}>
            <TRContextMenu.SubmenuRoot>
              <TRContextMenu.SubmenuTrigger>
                Move to <svg aria-hidden="true" />
              </TRContextMenu.SubmenuTrigger>
            </TRContextMenu.SubmenuRoot>
          </TRContextMenu.Popup>
        </TRContextMenu.Positioner>
      </TRContextMenu.Portal>
    </TRContextMenu.Root>,
  );
  document.querySelector('.tr-context-menu-trigger')?.dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      button: 2,
      clientX: 180,
      clientY: 120,
    }),
  );
  await expect
    .poll(() => document.querySelector('.tr-context-menu-popup'))
    .not.toBeNull();
  const backdrop = document.querySelector<HTMLElement>('.tr-context-menu-backdrop');
  const popup = document.querySelector<HTMLElement>('.tr-context-menu-popup');
  const submenu = document.querySelector<HTMLElement>(
    '.tr-context-menu-submenu-trigger',
  );
  const chevron = submenu?.querySelector<SVGElement>('svg');
  const popupRect = (popup as HTMLElement).getBoundingClientRect();
  expect(
    document
      .querySelector('.tr-context-menu-positioner')
      ?.getAttribute('data-context-point'),
  ).toBe('180,120');
  expect(getComputedStyle(backdrop as HTMLElement).backgroundColor).toBe(
    'rgba(0, 0, 0, 0)',
  );
  expect(Math.abs(popupRect.left - 180)).toBeLessThan(24);
  expect(Math.abs(popupRect.top - 120)).toBeLessThan(24);
  const submenuRect = (submenu as HTMLElement).getBoundingClientRect();
  const chevronRect = (chevron as SVGElement).getBoundingClientRect();
  expect(
    Math.abs(
      chevronRect.top +
        chevronRect.height / 2 -
        (submenuRect.top + submenuRect.height / 2),
    ),
  ).toBeLessThan(2);
  expect(submenuRect.right - chevronRect.right).toBeLessThan(24);
});
