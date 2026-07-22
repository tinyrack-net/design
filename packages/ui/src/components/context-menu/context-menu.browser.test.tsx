import '../../core/core.css';
import './context-menu.css';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { createRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
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

test('supports the ContextMenu key and preserves consumer keyboard cancellation', async () => {
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
    new KeyboardEvent('keydown', { bubbles: true, key: 'ContextMenu' }),
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
  expect(positioners[0]?.hasAttribute('data-context-point')).toBe(false);
  expect(
    (positioners[0] as HTMLElement | undefined)?.style.getPropertyValue(
      '--tr-context-menu-x',
    ),
  ).toBe('');
  expect(positioners[1]?.hasAttribute('data-context-point')).toBe(false);
});

test('merges functional positioner styles with pointer coordinate fallback', async () => {
  const style = vi.fn(() => ({ opacity: 0.75 }));
  await render(
    <TRContextMenu.Root>
      <TRContextMenu.Trigger>Functional style target</TRContextMenu.Trigger>
      <TRContextMenu.Portal>
        <TRContextMenu.Positioner style={style}>
          <TRContextMenu.Popup>
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
      clientX: 88,
      clientY: 64,
    }),
  );

  await expect.poll(() => document.querySelector('[role="menu"]')).not.toBeNull();
  const positioner = document.querySelector<HTMLElement>('.tr-context-menu-positioner');
  expect(style).toHaveBeenCalled();
  expect(positioner?.style.opacity).toBe('0.75');
  expect(positioner?.style.getPropertyValue('--tr-context-menu-x')).toBe('88px');
  expect(positioner?.style.getPropertyValue('--tr-context-menu-y')).toBe('64px');
  expect(positioner?.getAttribute('data-context-point')).toBe('88,64');
});

test('merges object positioner styles with pointer coordinate fallback', async () => {
  await render(
    <TRContextMenu.Root>
      <TRContextMenu.Trigger>Object style target</TRContextMenu.Trigger>
      <TRContextMenu.Portal keepMounted>
        <TRContextMenu.Positioner style={{ opacity: 0.5 }}>
          <TRContextMenu.Popup>
            <TRContextMenu.Item>Inspect</TRContextMenu.Item>
          </TRContextMenu.Popup>
        </TRContextMenu.Positioner>
      </TRContextMenu.Portal>
    </TRContextMenu.Root>,
  );

  const keptMountedPositioner = document.querySelector<HTMLElement>(
    '.tr-context-menu-positioner',
  );
  expect(keptMountedPositioner?.hasAttribute('data-context-point')).toBe(false);
  expect(keptMountedPositioner?.style.getPropertyValue('--tr-context-menu-x')).toBe('');

  document.querySelector('.tr-context-menu-trigger')?.dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      button: 2,
      clientX: 104,
      clientY: 76,
    }),
  );

  await expect.poll(() => document.querySelector('[role="menu"]')).not.toBeNull();
  const positioner = document.querySelector<HTMLElement>('.tr-context-menu-positioner');
  expect(positioner?.style.opacity).toBe('0.5');
  expect(positioner?.style.getPropertyValue('--tr-context-menu-x')).toBe('104px');
  expect(positioner?.style.getPropertyValue('--tr-context-menu-y')).toBe('76px');
  expect(positioner?.getAttribute('data-context-point')).toBe('104,76');
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

test('supports typeahead and keyboard navigation through a submenu', async () => {
  await render(
    <TRContextMenu.Root>
      <TRContextMenu.Trigger render={<button type="button" />}>
        Rack target
      </TRContextMenu.Trigger>
      <TRContextMenu.Portal>
        <TRContextMenu.Positioner>
          <TRContextMenu.Popup>
            <TRContextMenu.Item>Inspect</TRContextMenu.Item>
            <TRContextMenu.SubmenuRoot>
              <TRContextMenu.SubmenuTrigger>Move to</TRContextMenu.SubmenuTrigger>
              <TRContextMenu.Portal>
                <TRContextMenu.Positioner>
                  <TRContextMenu.Popup>
                    <TRContextMenu.Item>Production</TRContextMenu.Item>
                    <TRContextMenu.Item>Staging</TRContextMenu.Item>
                  </TRContextMenu.Popup>
                </TRContextMenu.Positioner>
              </TRContextMenu.Portal>
            </TRContextMenu.SubmenuRoot>
          </TRContextMenu.Popup>
        </TRContextMenu.Positioner>
      </TRContextMenu.Portal>
    </TRContextMenu.Root>,
  );

  const trigger = page.getByRole('button', { name: 'Rack target' });
  trigger.element().focus();
  await userEvent.keyboard('{Shift>}{F10}{/Shift}');
  await expect.element(page.getByRole('menu')).toHaveFocus();

  await userEvent.keyboard('m');
  const submenuTrigger = page.getByRole('menuitem', { name: 'Move to' });
  await expect.element(submenuTrigger).toHaveFocus();
  await userEvent.keyboard('{ArrowRight}');
  await expect
    .element(page.getByRole('menuitem', { name: 'Production' }))
    .toHaveFocus();

  await userEvent.keyboard('{Escape}');
  await expect.element(submenuTrigger).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  await expect.element(trigger).toHaveFocus();
});

test('keeps selection items open, blocks disabled commands, and renders links', async () => {
  const onDisabledClick = vi.fn();
  const onCheckedChange = vi.fn();
  const onValueChange = vi.fn();
  await render(
    <TRContextMenu.Root>
      <TRContextMenu.Trigger>Rack target</TRContextMenu.Trigger>
      <TRContextMenu.Portal>
        <TRContextMenu.Positioner>
          <TRContextMenu.Popup aria-label="View options">
            <TRContextMenu.Item disabled onClick={onDisabledClick}>
              Unavailable
            </TRContextMenu.Item>
            <TRContextMenu.LinkItem href="#rack-details">
              Open details
            </TRContextMenu.LinkItem>
            <TRContextMenu.CheckboxItem onCheckedChange={onCheckedChange}>
              Show labels
            </TRContextMenu.CheckboxItem>
            <TRContextMenu.RadioGroup
              defaultValue="comfortable"
              onValueChange={onValueChange}
            >
              <TRContextMenu.RadioItem value="comfortable">
                Comfortable
              </TRContextMenu.RadioItem>
              <TRContextMenu.RadioItem value="compact">Compact</TRContextMenu.RadioItem>
            </TRContextMenu.RadioGroup>
          </TRContextMenu.Popup>
        </TRContextMenu.Positioner>
      </TRContextMenu.Portal>
    </TRContextMenu.Root>,
  );

  document.querySelector('.tr-context-menu-trigger')?.dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      button: 2,
      clientX: 40,
      clientY: 40,
    }),
  );
  const menu = page.getByRole('menu', { name: 'View options' });
  await expect.element(menu).toBeVisible();
  page
    .getByRole('menuitem', { name: 'Unavailable' })
    .element()
    .dispatchEvent(new MouseEvent('click', { bubbles: true }));
  expect(onDisabledClick).not.toHaveBeenCalled();

  const link = page.getByRole('menuitem', { name: 'Open details' });
  await expect.element(link).toHaveAttribute('href', '#rack-details');
  const checkbox = page.getByRole('menuitemcheckbox', { name: 'Show labels' });
  await userEvent.click(checkbox.element());
  expect(onCheckedChange.mock.calls.at(-1)?.[0]).toBe(true);
  await expect.element(menu).toBeVisible();

  const compact = page.getByRole('menuitemradio', { name: 'Compact' });
  await userEvent.click(compact.element());
  expect(onValueChange.mock.calls.at(-1)?.[0]).toBe('compact');
  await expect.element(compact).toHaveAttribute('aria-checked', 'true');
  await expect.element(menu).toBeVisible();
});

test('preserves refs and native props, uses a custom portal, and controls dismissal', async () => {
  const portalContainer = document.createElement('div');
  document.body.append(portalContainer);
  const triggerRef = createRef<HTMLDivElement>();
  const popupRef = createRef<HTMLDivElement>();
  const onOpenChange = vi.fn();

  function ControlledContextMenu() {
    const [open, setOpen] = useState(false);
    return (
      <TRContextMenu.Root
        onOpenChange={(nextOpen, details) => {
          onOpenChange(nextOpen, details.reason);
          setOpen(nextOpen);
        }}
        open={open}
      >
        <TRContextMenu.Trigger
          aria-label="Controlled rack"
          data-owner="consumer"
          ref={triggerRef}
          render={<button type="button" />}
        />
        <TRContextMenu.Portal container={portalContainer}>
          <TRContextMenu.Backdrop />
          <TRContextMenu.Positioner>
            <TRContextMenu.Popup aria-label="Controlled actions" ref={popupRef}>
              <TRContextMenu.Item>Inspect</TRContextMenu.Item>
            </TRContextMenu.Popup>
          </TRContextMenu.Positioner>
        </TRContextMenu.Portal>
      </TRContextMenu.Root>
    );
  }

  await render(<ControlledContextMenu />);
  expect(triggerRef.current?.dataset['owner']).toBe('consumer');
  triggerRef.current?.focus();
  triggerRef.current?.dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      button: 2,
      clientX: 52,
      clientY: 52,
    }),
  );
  await expect
    .element(page.getByRole('menu', { name: 'Controlled actions' }))
    .toBeVisible();
  expect(portalContainer.contains(popupRef.current)).toBe(true);
  expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(true);

  await userEvent.keyboard('{Escape}');
  await expect.poll(() => popupRef.current).toBeNull();
  expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
  await expect
    .element(page.getByRole('button', { name: 'Controlled rack' }))
    .toHaveFocus();

  triggerRef.current?.dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      button: 2,
      clientX: 60,
      clientY: 60,
    }),
  );
  await expect
    .poll(() => portalContainer.querySelector('.tr-context-menu-backdrop'))
    .not.toBeNull();
  await userEvent.click(
    portalContainer.querySelector<HTMLElement>(
      '.tr-context-menu-backdrop',
    ) as HTMLElement,
  );
  await expect.poll(() => popupRef.current).toBeNull();
  expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
  portalContainer.remove();
});

test('does not open when the root is disabled', async () => {
  await render(
    <TRContextMenu.Root disabled>
      <TRContextMenu.Trigger>Disabled target</TRContextMenu.Trigger>
      <TRContextMenu.Portal>
        <TRContextMenu.Positioner>
          <TRContextMenu.Popup>
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
      clientX: 24,
      clientY: 24,
    }),
  );
  expect(document.querySelector('[role="menu"]')).toBeNull();
});
