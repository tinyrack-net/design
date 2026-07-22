import './menubar.css';
import { act, type CSSProperties, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import '../../core/core.css';
import { TRMenu } from '../menu/index.js';
import { TRMenubar } from './index.js';

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

test('renders the Tinyrack TRMenubar wrapper', async () => {
  expect(typeof TRMenubar).toBe('function');
  await render(<TRMenubar aria-label="Application menu">Menu</TRMenubar>);
  expect(document.querySelector('.tr-menubar')).not.toBeNull();
});

test('preserves refs, native props and events, consumer classes, and render composition', async () => {
  const ref = createRef<HTMLDivElement>();
  const onClick = vi.fn();

  await render(
    <TRMenubar
      aria-label="Rendered application menu"
      className="consumer-menubar"
      data-application="rack-editor"
      onClick={onClick}
      ref={ref}
      render={<section />}
      style={{ minWidth: 240 }}
    >
      <TRMenu.Root>
        <TRMenu.Trigger>File</TRMenu.Trigger>
      </TRMenu.Root>
    </TRMenubar>,
  );

  const menubar = page.getByRole('menubar', { name: 'Rendered application menu' });
  expect(ref.current).toBe(menubar.element());
  expect(menubar.element().tagName).toBe('SECTION');
  expect(menubar.element()).toHaveClass('tr-menubar', 'consumer-menubar');
  expect(menubar.element()).toHaveAttribute('data-application', 'rack-editor');
  expect(getComputedStyle(menubar.element()).minWidth).toBe('240px');
  await userEvent.click(page.getByRole('menuitem', { name: 'File' }));
  expect(onClick).toHaveBeenCalledOnce();
});

test('maintains one roving tab stop and skips an individually disabled menu', async () => {
  await render(
    <TRMenubar aria-label="Application menu">
      <TRMenu.Root>
        <TRMenu.Trigger>File</TRMenu.Trigger>
      </TRMenu.Root>
      <TRMenu.Root disabled>
        <TRMenu.Trigger>Edit</TRMenu.Trigger>
      </TRMenu.Root>
      <TRMenu.Root>
        <TRMenu.Trigger>View</TRMenu.Trigger>
      </TRMenu.Root>
    </TRMenubar>,
  );

  const file = page.getByRole('menuitem', { name: 'File' });
  const edit = page.getByRole('menuitem', { name: 'Edit' });
  const view = page.getByRole('menuitem', { name: 'View' });
  expect(file.element()).toHaveAttribute('tabindex', '0');
  expect(edit.element()).toHaveAttribute('tabindex', '-1');
  expect(edit.element()).toHaveAttribute('aria-disabled', 'true');
  expect(view.element()).toHaveAttribute('tabindex', '-1');
  file.element().focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(view.element());
  expect(file.element()).toHaveAttribute('tabindex', '-1');
  expect(view.element()).toHaveAttribute('tabindex', '0');
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

test('switches the open menu with horizontal navigation', async () => {
  const onFileOpenChange = vi.fn();
  const onEditOpenChange = vi.fn();
  await render(
    <TRMenubar aria-label="Application menu">
      <TRMenu.Root onOpenChange={onFileOpenChange}>
        <TRMenu.Trigger>File</TRMenu.Trigger>
        <TRMenu.Portal>
          <TRMenu.Positioner>
            <TRMenu.Popup>
              <TRMenu.Item>New</TRMenu.Item>
            </TRMenu.Popup>
          </TRMenu.Positioner>
        </TRMenu.Portal>
      </TRMenu.Root>
      <TRMenu.Root onOpenChange={onEditOpenChange}>
        <TRMenu.Trigger>Edit</TRMenu.Trigger>
        <TRMenu.Portal>
          <TRMenu.Positioner>
            <TRMenu.Popup>
              <TRMenu.Item>Undo</TRMenu.Item>
            </TRMenu.Popup>
          </TRMenu.Positioner>
        </TRMenu.Portal>
      </TRMenu.Root>
    </TRMenubar>,
  );

  const file = page.getByRole('menuitem', { name: 'File' });
  const newItem = page.getByRole('menuitem', { name: 'New' });
  await userEvent.tab();
  expect(document.activeElement).toBe(file.element());
  await userEvent.keyboard('{Enter}');
  await expect.poll(() => newItem.query()).not.toBeNull();
  await expect.poll(() => document.activeElement).toBe(newItem.element());
  await userEvent.keyboard('{ArrowRight}');
  await expect
    .poll(() => page.getByRole('menuitem', { name: 'Undo' }).query())
    .not.toBeNull();
  expect(onFileOpenChange).toHaveBeenCalledWith(false, expect.any(Object));
  expect(onEditOpenChange).toHaveBeenCalledWith(true, expect.any(Object));
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
  const menubar = document.querySelector<HTMLElement>('.tr-menubar');
  file?.focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(document.activeElement).toBe(file);
  await userEvent.keyboard('{ArrowDown}');
  expect(document.activeElement).toBe(edit);
  expect(getComputedStyle(menubar as HTMLElement).flexDirection).toBe('column');
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

test('applies consumer menubar tokens without replacing semantic defaults', async () => {
  await render(
    <div data-theme="tinyrack-light">
      <TRMenubar
        aria-label="Branded application menu"
        style={
          {
            '--tr-menubar-background': 'rgb(12, 34, 56)',
            '--tr-menubar-color': 'rgb(245, 246, 247)',
          } as CSSProperties
        }
      >
        <TRMenu.Root>
          <TRMenu.Trigger>File</TRMenu.Trigger>
        </TRMenu.Root>
      </TRMenubar>
    </div>,
  );

  const menubar = page.getByRole('menubar', { name: 'Branded application menu' });
  const style = getComputedStyle(menubar.element());
  expect(style.backgroundColor).toBe('rgb(12, 34, 56)');
  expect(style.color).toBe('rgb(245, 246, 247)');
  expect(style.borderTopStyle).toBe('solid');
});

test('server-renders and hydrates menu integration without recovery', async () => {
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  const fixture = (
    <TRMenubar aria-label="Hydrated application menu">
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
  const trigger = host.querySelector<HTMLButtonElement>('.tr-menu-trigger');
  trigger?.click();
  await expect
    .poll(() => document.querySelector('.tr-menu-content')?.hasAttribute('data-open'))
    .toBe(true);

  await act(async () => root.unmount());
  host.remove();
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
});
