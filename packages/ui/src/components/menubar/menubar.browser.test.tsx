import './menubar.css';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import '../../core/core.css';
import { Menu } from '../menu/index.js';
import '../menu/menu.css';
import { Menubar } from './index.js';

test('renders the Tinyrack Menubar wrapper', async () => {
  expect(typeof Menubar).toBe('function');
  await render(<Menubar aria-label="Application menu">Menu</Menubar>);
  expect(document.querySelector('.tr-menubar')).not.toBeNull();
});

test('moves focus between menus and restores the trigger after dismissal', async () => {
  await render(
    <Menubar aria-label="Application menu" loopFocus>
      {['File', 'Edit', 'View'].map((label) => (
        <Menu.Root key={label}>
          <Menu.Trigger>{label}</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.Item>{label} command</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      ))}
    </Menubar>,
  );

  const menubar = document.querySelector<HTMLElement>('.tr-menubar');
  const triggers = Array.from(
    document.querySelectorAll<HTMLButtonElement>('.tr-menu-trigger'),
  );
  const [file, edit, view] = triggers;

  expect(menubar?.getAttribute('role')).toBe('menubar');
  expect(menubar?.getAttribute('aria-label')).toBe('Application menu');
  expect(triggers).toHaveLength(3);
  expect(
    Number.parseFloat(getComputedStyle(file as Element).minHeight),
  ).toBeGreaterThanOrEqual(32);
  expect(
    Number.parseFloat(getComputedStyle(file as Element).paddingInlineStart),
  ).toBeGreaterThan(0);

  file?.focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(edit);
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(view);
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(file);

  await userEvent.keyboard('{Enter}');
  await expect
    .poll(() => document.querySelector('.tr-menu-content')?.hasAttribute('data-open'))
    .toBe(true);
  await userEvent.keyboard('{Escape}');
  await expect.poll(() => document.activeElement).toBe(file);
  await expect
    .poll(
      () =>
        document.querySelector('.tr-menu-content')?.hasAttribute('data-open') ?? false,
    )
    .toBe(false);
});

test('uses vertical keys, respects loop boundaries, and blocks disabled roots', async () => {
  await render(
    <Menubar
      aria-label="Vertical application menu"
      loopFocus={false}
      orientation="vertical"
    >
      {['File', 'Edit', 'View'].map((label) => (
        <Menu.Root key={label}>
          <Menu.Trigger>{label}</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.Item>{label} command</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      ))}
    </Menubar>,
  );

  const [file, edit] = Array.from(
    document.querySelectorAll<HTMLButtonElement>('.tr-menu-trigger'),
  );
  file?.focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(document.activeElement).toBe(file);
  await userEvent.keyboard('{ArrowDown}');
  expect(document.activeElement).toBe(edit);
});

test('does not open menus when the menubar is disabled', async () => {
  await render(
    <Menubar aria-label="Disabled application menu" disabled>
      <Menu.Root>
        <Menu.Trigger>File</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.Item>New</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Menubar>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('.tr-menu-trigger');
  expect(trigger?.disabled).toBe(true);
  expect(trigger?.getAttribute('aria-disabled')).toBe('true');
  trigger?.click();
  expect(
    document.querySelector('.tr-menu-content')?.hasAttribute('data-open') ?? false,
  ).toBe(false);
});

test('preserves menu checkbox semantics and change callbacks', async () => {
  const onCheckedChange = vi.fn();
  await render(
    <Menubar aria-label="View menu">
      <Menu.Root>
        <Menu.Trigger>View</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.CheckboxItem defaultChecked onCheckedChange={onCheckedChange}>
                <Menu.CheckboxItemIndicator>✓</Menu.CheckboxItemIndicator>
                Show labels
              </Menu.CheckboxItem>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Menubar>,
  );

  document.querySelector<HTMLButtonElement>('.tr-menu-trigger')?.click();
  await expect
    .poll(() =>
      document
        .querySelector<HTMLElement>('[role="menuitemcheckbox"]')
        ?.getAttribute('aria-checked'),
    )
    .toBe('true');
  const item = document.querySelector<HTMLElement>('[role="menuitemcheckbox"]');
  item?.click();
  await expect.poll(() => onCheckedChange.mock.calls.at(-1)?.[0]).toBe(false);
});
