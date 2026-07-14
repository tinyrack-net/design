import './menu.css';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Menu, MenuRoot } from './index.js';

function ActionsMenu({ onRestart }: { onRestart?: () => void }) {
  return (
    <Menu.Root>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item onClick={onRestart}>Restart</Menu.Item>
            <Menu.Item>Rename</Menu.Item>
            <Menu.Item disabled>Unavailable</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

test('opens from the trigger and exposes Tinyrack menu semantics', async () => {
  expect(Menu.Root).toBe(MenuRoot);
  await render(<ActionsMenu />);
  const trigger = page.getByRole('button', { name: 'Actions' }).element();
  await userEvent.click(trigger);

  const menu = page.getByRole('menu', { name: 'Actions' }).element();
  expect(menu).toHaveClass('tr-layer', 'tr-menu-content');
  expect(page.getByRole('menuitem', { name: 'Restart' }).element()).toHaveClass(
    'tr-menu-item',
  );
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
});

test('uses keyboard typeahead, activates an item, and restores trigger focus', async () => {
  const onRestart = vi.fn();
  await render(<ActionsMenu onRestart={onRestart} />);
  const trigger = page.getByRole('button', { name: 'Actions' }).element();
  trigger.focus();
  await userEvent.keyboard('{Enter}');
  await expect.poll(() => trigger.getAttribute('aria-expanded')).toBe('true');

  await userEvent.keyboard('{Home}');
  const restart = page.getByRole('menuitem', { name: 'Restart' }).element();
  await expect.poll(() => restart.hasAttribute('data-highlighted')).toBe(true);
  await userEvent.keyboard('{Enter}');
  expect(onRestart).toHaveBeenCalledOnce();
  await expect.poll(() => trigger.getAttribute('aria-expanded')).toBe('false');
  await expect.poll(() => document.activeElement).toBe(trigger);
});

test('updates checkbox and radio items without closing the menu', async () => {
  const onCheckedChange = vi.fn();
  const onValueChange = vi.fn();
  await render(
    <Menu.Root defaultOpen>
      <Menu.Trigger>Display</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.CheckboxItem onCheckedChange={onCheckedChange}>
              Compact
            </Menu.CheckboxItem>
            <Menu.RadioGroup defaultValue="light" onValueChange={onValueChange}>
              <Menu.RadioItem value="light">Light</Menu.RadioItem>
              <Menu.RadioItem value="dark">Dark</Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>,
  );

  const checkbox = page.getByRole('menuitemcheckbox', { name: 'Compact' }).element();
  await userEvent.click(checkbox);
  expect(onCheckedChange.mock.calls.at(-1)?.[0]).toBe(true);
  expect(checkbox.getAttribute('aria-checked')).toBe('true');

  const dark = page.getByRole('menuitemradio', { name: 'Dark' }).element();
  await userEvent.click(dark);
  expect(onValueChange.mock.calls.at(-1)?.[0]).toBe('dark');
  expect(dark.getAttribute('aria-checked')).toBe('true');
  expect(document.querySelector('.tr-menu-content')?.hasAttribute('data-open')).toBe(
    true,
  );
});

test('dismisses with Escape and keeps the positioned popup in viewport bounds', async () => {
  await render(<ActionsMenu />);
  const trigger = page.getByRole('button', { name: 'Actions' }).element();
  await userEvent.click(trigger);
  await expect.poll(() => trigger.getAttribute('aria-expanded')).toBe('true');
  const popup = document.querySelector<HTMLElement>('.tr-menu-content') as HTMLElement;
  const rect = popup.getBoundingClientRect();
  expect(rect.left).toBeGreaterThanOrEqual(0);
  expect(rect.right).toBeLessThanOrEqual(window.innerWidth);
  await userEvent.keyboard('{Escape}');
  await expect.poll(() => trigger.getAttribute('aria-expanded')).toBe('false');
  await expect.poll(() => document.activeElement).toBe(trigger);
});
