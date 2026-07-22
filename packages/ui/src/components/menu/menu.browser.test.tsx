import '../../core/core.css';
import './menu.css';
import { act, type CSSProperties, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRMenu, TRMenuRoot } from './index.js';

const constrainedCommands = [
  'Restart rack',
  'Rename rack',
  'Duplicate rack',
  'Archive rack',
  'Export rack',
  'Move rack',
  'Inspect rack',
  'Stop rack',
  'Delete rack',
  'Restore rack',
];

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
  await userEvent.keyboard('{ArrowDown}r');
  await expect.element(restart).toHaveAttribute('data-highlighted');
  expect(getComputedStyle(restart.element()).outlineStyle).toBe('solid');
  await userEvent.keyboard('{Enter}');
  expect(onRestart).toHaveBeenCalledOnce();
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect.element(trigger).toHaveFocus();
});

test('preserves typed detached payloads, consumer props, refs, and render elements', async () => {
  const handle = TRMenu.createHandle<{ rack: string }>();
  const triggerRef = createRef<HTMLButtonElement>();
  const onInspect = vi.fn();
  const screen = await render(
    <>
      <TRMenu.Trigger
        aria-describedby="menu-help"
        className="consumer-trigger"
        handle={handle}
        payload={{ rack: 'Rack Echo' }}
        ref={triggerRef}
        render={<button type="button" />}
      >
        Typed actions
      </TRMenu.Trigger>
      <span id="menu-help">Rack commands</span>
      <TRMenu.Root handle={handle}>
        {({ payload }) => (
          <TRMenu.Portal>
            <TRMenu.Positioner>
              <TRMenu.Popup>
                <TRMenu.Item onClick={() => onInspect(payload?.rack)}>
                  Inspect {payload?.rack}
                </TRMenu.Item>
              </TRMenu.Popup>
            </TRMenu.Positioner>
          </TRMenu.Portal>
        )}
      </TRMenu.Root>
    </>,
  );

  const trigger = screen.getByRole('button', { name: 'Typed actions' });
  expect(triggerRef.current).toBe(trigger.element());
  await expect.element(trigger).toHaveClass('tr-menu-trigger', 'consumer-trigger');
  await expect.element(trigger).toHaveAttribute('aria-describedby', 'menu-help');
  await userEvent.click(trigger);
  await userEvent.click(screen.getByRole('menuitem', { name: 'Inspect Rack Echo' }));
  expect(onInspect).toHaveBeenCalledWith('Rack Echo');
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

test('skips disabled items, opens a submenu by keyboard, and dismisses from outside', async () => {
  const onDisabled = vi.fn();
  const screen = await render(
    <div>
      <button type="button">Outside</button>
      <TRMenu.Root modal={false}>
        <TRMenu.Trigger>Arrange</TRMenu.Trigger>
        <TRMenu.Portal>
          <TRMenu.Positioner>
            <TRMenu.Popup>
              <TRMenu.Item disabled onClick={onDisabled}>
                Unavailable
              </TRMenu.Item>
              <TRMenu.SubmenuRoot>
                <TRMenu.SubmenuTrigger>Move to</TRMenu.SubmenuTrigger>
                <TRMenu.Portal>
                  <TRMenu.Positioner>
                    <TRMenu.Popup>
                      <TRMenu.Item>Production</TRMenu.Item>
                    </TRMenu.Popup>
                  </TRMenu.Positioner>
                </TRMenu.Portal>
              </TRMenu.SubmenuRoot>
            </TRMenu.Popup>
          </TRMenu.Positioner>
        </TRMenu.Portal>
      </TRMenu.Root>
    </div>,
  );
  const trigger = screen.getByRole('button', { name: 'Arrange' });
  await userEvent.type(trigger, '{Enter}');
  const disabled = screen.getByRole('menuitem', { name: 'Unavailable' });
  const submenu = screen.getByRole('menuitem', { name: 'Move to' });
  await expect.element(disabled).toHaveAttribute('aria-disabled', 'true');
  await expect.element(submenu).toHaveFocus();
  await userEvent.keyboard('{ArrowRight}');
  await expect
    .element(screen.getByRole('menuitem', { name: 'Production' }))
    .toHaveFocus();
  await userEvent.keyboard('{Escape}');
  await expect.element(submenu).toHaveFocus();
  await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(onDisabled).not.toHaveBeenCalled();
});

test('uses a custom portal container and preserves link navigation semantics', async () => {
  const container = document.createElement('div');
  const screen = await render(
    <TRMenu.Root>
      <TRMenu.Trigger>Links</TRMenu.Trigger>
      <TRMenu.Portal container={container}>
        <TRMenu.Positioner>
          <TRMenu.Popup>
            <TRMenu.LinkItem closeOnClick href="#menu-destination">
              Rack details
            </TRMenu.LinkItem>
          </TRMenu.Popup>
        </TRMenu.Positioner>
      </TRMenu.Portal>
    </TRMenu.Root>,
  );
  document.body.append(container);
  const trigger = screen.getByRole('button', { name: 'Links' });
  await userEvent.click(trigger);
  const link = screen.getByRole('menuitem', { name: 'Rack details' });
  expect(container.contains(link.element())).toBe(true);
  await userEvent.click(link);
  expect(window.location.hash).toBe('#menu-destination');
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
  container.remove();
  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}${window.location.search}`,
  );
});

test('honors Base UI available space on constrained viewports', async () => {
  await render(
    <TRMenu.Root defaultOpen>
      <TRMenu.Trigger>Constrained</TRMenu.Trigger>
      <TRMenu.Portal>
        <TRMenu.Positioner>
          <TRMenu.Popup
            style={
              {
                '--available-height': '100px',
                '--available-width': '120px',
              } as CSSProperties
            }
          >
            {constrainedCommands.map((command) => (
              <TRMenu.Item key={command}>{command}</TRMenu.Item>
            ))}
          </TRMenu.Popup>
        </TRMenu.Positioner>
      </TRMenu.Portal>
    </TRMenu.Root>,
  );

  const popup = document.querySelector<HTMLElement>('.tr-menu-content');
  const rect = (popup as HTMLElement).getBoundingClientRect();
  expect(rect.width).toBeLessThanOrEqual(120);
  expect(rect.height).toBeLessThanOrEqual(100);
  expect(getComputedStyle(popup as HTMLElement).overflowY).toBe('auto');
});

test('renders and hydrates the menu trigger without recovery', async () => {
  const fixture = (
    <TRMenu.Root>
      <TRMenu.Trigger>Hydrated actions</TRMenu.Trigger>
      <TRMenu.Portal>
        <TRMenu.Positioner>
          <TRMenu.Popup>
            <TRMenu.Item>Restart</TRMenu.Item>
          </TRMenu.Popup>
        </TRMenu.Positioner>
      </TRMenu.Portal>
    </TRMenu.Root>
  );
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, fixture, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  expect(hydrationErrors).toEqual([]);
  expect(host.querySelector('.tr-menu-trigger')?.textContent).toBe('Hydrated actions');
  await act(async () => root.unmount());
  host.remove();
});
