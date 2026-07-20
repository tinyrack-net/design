import './menubar.css';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import '../../core/core.css';
import { TRMenu } from '../menu/index.js';
import '../menu/menu.css';
import { TRMenubar } from './index.js';

test('renders the Tinyrack TRMenubar wrapper', async () => {
  expect(typeof TRMenubar).toBe('function');
  await render(<TRMenubar aria-label="Application menu">Menu</TRMenubar>);
  expect(document.querySelector('.tr-menubar')).not.toBeNull();
});

test('moves focus between menus and restores the trigger after dismissal', async () => {
  await render(
    <TRMenubar aria-label="Application menu" loopFocus>
      {['File', 'Edit', 'View'].map((label) => (
        <TRMenu.Root key={label}>
          <TRMenu.Trigger>{label}</TRMenu.Trigger>
          <TRMenu.Portal>
            <TRMenu.Positioner>
              <TRMenu.Popup>
                <TRMenu.Item>{label} command</TRMenu.Item>
              </TRMenu.Popup>
            </TRMenu.Positioner>
          </TRMenu.Portal>
        </TRMenu.Root>
      ))}
    </TRMenubar>,
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
    <TRMenubar
      aria-label="Vertical application menu"
      loopFocus={false}
      orientation="vertical"
    >
      {['File', 'Edit', 'View'].map((label) => (
        <TRMenu.Root key={label}>
          <TRMenu.Trigger>{label}</TRMenu.Trigger>
          <TRMenu.Portal>
            <TRMenu.Positioner>
              <TRMenu.Popup>
                <TRMenu.Item>{label} command</TRMenu.Item>
              </TRMenu.Popup>
            </TRMenu.Positioner>
          </TRMenu.Portal>
        </TRMenu.Root>
      ))}
    </TRMenubar>,
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
    <TRMenubar aria-label="Disabled application menu" disabled>
      <TRMenu.Root>
        <TRMenu.Trigger>File</TRMenu.Trigger>
        <TRMenu.Portal>
          <TRMenu.Positioner>
            <TRMenu.Popup>
              <TRMenu.Item>New</TRMenu.Item>
            </TRMenu.Popup>
          </TRMenu.Positioner>
        </TRMenu.Portal>
      </TRMenu.Root>
    </TRMenubar>,
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
    <TRMenubar aria-label="View menu">
      <TRMenu.Root>
        <TRMenu.Trigger>View</TRMenu.Trigger>
        <TRMenu.Portal>
          <TRMenu.Positioner>
            <TRMenu.Popup>
              <TRMenu.CheckboxItem defaultChecked onCheckedChange={onCheckedChange}>
                <TRMenu.CheckboxItemIndicator>✓</TRMenu.CheckboxItemIndicator>
                Show labels
              </TRMenu.CheckboxItem>
            </TRMenu.Popup>
          </TRMenu.Positioner>
        </TRMenu.Portal>
      </TRMenu.Root>
    </TRMenubar>,
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

test('lets outside focus dismiss a non-modal menu without trapping focus', async () => {
  await render(
    <>
      <TRMenubar aria-label="Non-modal application menu" modal={false}>
        <TRMenu.Root>
          <TRMenu.Trigger>File</TRMenu.Trigger>
          <TRMenu.Portal>
            <TRMenu.Positioner>
              <TRMenu.Popup>
                <TRMenu.Item>New</TRMenu.Item>
              </TRMenu.Popup>
            </TRMenu.Positioner>
          </TRMenu.Portal>
        </TRMenu.Root>
      </TRMenubar>
      <button type="button">Outside focus target</button>
    </>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('.tr-menu-trigger');
  const outside = Array.from(
    document.querySelectorAll<HTMLButtonElement>('button'),
  ).find((button) => button.textContent === 'Outside focus target');
  trigger?.click();
  await expect
    .poll(() => document.querySelector('.tr-menu-content')?.hasAttribute('data-open'))
    .toBe(true);
  await userEvent.click(outside as HTMLButtonElement);
  await expect.poll(() => document.activeElement).toBe(outside);
  await expect
    .poll(() => document.querySelector('.tr-menu-content')?.hasAttribute('data-open'))
    .not.toBe(true);
});
