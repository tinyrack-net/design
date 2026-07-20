import '../../core/core.css';
import './menu.css';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRMenu, TRMenuRoot } from './index.js';

function ActionsMenu({ onRestart }: { onRestart?: () => void }) {
  return (
    <TRMenu.Root>
      <TRMenu.Trigger>Actions</TRMenu.Trigger>
      <TRMenu.Portal>
        <TRMenu.Positioner>
          <TRMenu.Popup>
            <TRMenu.Item onClick={onRestart}>Restart</TRMenu.Item>
            <TRMenu.Item>Rename</TRMenu.Item>
            <TRMenu.Item disabled>Unavailable</TRMenu.Item>
          </TRMenu.Popup>
        </TRMenu.Positioner>
      </TRMenu.Portal>
    </TRMenu.Root>
  );
}

test('opens from the trigger and exposes Tinyrack menu semantics', async () => {
  expect(TRMenu.Root).toBe(TRMenuRoot);
  const screen = await render(<ActionsMenu />);
  const trigger = screen.getByRole('button', { name: 'Actions' });
  await userEvent.click(trigger);

  await expect
    .element(screen.getByRole('menu', { name: 'Actions' }))
    .toHaveClass('tr-layer', 'tr-menu-content');
  await expect
    .element(screen.getByRole('menuitem', { name: 'Restart' }))
    .toHaveClass('tr-menu-item');
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true');
});

test('uses keyboard typeahead, activates an item, and restores trigger focus', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  const onRestart = vi.fn();
  const screen = await render(<ActionsMenu onRestart={onRestart} />);
  const trigger = screen.getByRole('button', { name: 'Actions' });
  await userEvent.type(trigger, '{Enter}');
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true');

  const restart = screen.getByRole('menuitem', { name: 'Restart' });
  await expect.element(restart).toHaveFocus();
  await userEvent.type(restart, '{Home}');
  await expect.element(restart).toHaveAttribute('data-highlighted');
  expect(getComputedStyle(restart.element()).outlineStyle).toBe('solid');
  await userEvent.type(restart, '{Enter}');
  expect(onRestart).toHaveBeenCalledOnce();
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect.element(trigger).toHaveFocus();
});

test('updates checkbox and radio items without closing the menu', async () => {
  const onCheckedChange = vi.fn();
  const onValueChange = vi.fn();
  await render(
    <TRMenu.Root defaultOpen>
      <TRMenu.Trigger>Display</TRMenu.Trigger>
      <TRMenu.Portal>
        <TRMenu.Positioner>
          <TRMenu.Popup>
            <TRMenu.CheckboxItem onCheckedChange={onCheckedChange}>
              Compact
            </TRMenu.CheckboxItem>
            <TRMenu.RadioGroup defaultValue="light" onValueChange={onValueChange}>
              <TRMenu.RadioItem value="light">Light</TRMenu.RadioItem>
              <TRMenu.RadioItem value="dark">Dark</TRMenu.RadioItem>
            </TRMenu.RadioGroup>
          </TRMenu.Popup>
        </TRMenu.Positioner>
      </TRMenu.Portal>
    </TRMenu.Root>,
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
  const screen = await render(<ActionsMenu />);
  const trigger = screen.getByRole('button', { name: 'Actions' });
  await userEvent.click(trigger);
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true');
  const popup = document.querySelector<HTMLElement>('.tr-menu-content') as HTMLElement;
  const rect = popup.getBoundingClientRect();
  expect(rect.left).toBeGreaterThanOrEqual(0);
  expect(rect.right).toBeLessThanOrEqual(window.innerWidth);
  const menu = screen.getByRole('menu');
  await expect.element(menu).toHaveFocus();
  await userEvent.type(menu, '{Escape}');
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect.element(trigger).toHaveFocus();
});

test('12-13 keeps modal backdrops behind the menu and accepts pointer commands', async () => {
  const onRestart = vi.fn();
  await render(
    <TRMenu.Root defaultOpen>
      <TRMenu.Trigger>Rack actions</TRMenu.Trigger>
      <TRMenu.Portal>
        <TRMenu.Backdrop />
        <TRMenu.Positioner>
          <TRMenu.Popup>
            <TRMenu.Item onClick={onRestart}>Restart rack</TRMenu.Item>
          </TRMenu.Popup>
        </TRMenu.Positioner>
      </TRMenu.Portal>
    </TRMenu.Root>,
  );

  const popup = document.querySelector<HTMLElement>('.tr-menu-content');
  const item = document.querySelector<HTMLElement>('.tr-menu-item');
  const backdrop = document.querySelector<HTMLElement>('.tr-menu-backdrop');
  expect(popup).not.toBeNull();
  expect(backdrop).not.toBeNull();
  const rect = (item as HTMLElement).getBoundingClientRect();
  expect(
    (
      document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      ) as HTMLElement | null
    )?.closest('.tr-menu-content'),
  ).toBe(popup);
  await userEvent.click(item as HTMLElement);
  expect(onRestart).toHaveBeenCalledOnce();
});

test('13 connects detached triggers through a menu handle and invokes commands', async () => {
  const handle = TRMenu.createHandle<{ rack: string }>();
  const onInspect = vi.fn();
  await render(
    <>
      <TRMenu.Trigger handle={handle} payload={{ rack: 'Rack Delta' }}>
        Detached rack actions
      </TRMenu.Trigger>
      <TRMenu.Root handle={handle}>
        {({ payload }) => (
          <TRMenu.Portal>
            <TRMenu.Backdrop />
            <TRMenu.Positioner>
              <TRMenu.Popup>
                <TRMenu.Item
                  onClick={() => onInspect((payload as { rack: string }).rack)}
                >
                  Inspect rack
                </TRMenu.Item>
              </TRMenu.Popup>
            </TRMenu.Positioner>
          </TRMenu.Portal>
        )}
      </TRMenu.Root>
    </>,
  );
  await userEvent.click(
    page.getByRole('button', { name: 'Detached rack actions' }).element(),
  );
  const item = page.getByRole('menuitem', { name: 'Inspect rack' });
  await expect.element(item).toBeVisible();
  await userEvent.click(item.element());
  expect(onInspect).toHaveBeenCalledWith('Rack Delta');
});
