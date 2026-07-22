import '../../core/core.css';
import './toolbar.css';
import { act, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRToolbar, TRToolbarRoot } from './index.js';

test('renders the Tinyrack TRToolbar wrapper', async () => {
  expect(TRToolbar.Root).toBe(TRToolbarRoot);
  await render(
    <TRToolbar.Root aria-label="Editor">
      <TRToolbar.Group aria-label="Formatting">
        <TRToolbar.Button>Bold</TRToolbar.Button>
      </TRToolbar.Group>
    </TRToolbar.Root>,
  );
  expect(document.querySelector('.tr-toolbar')).not.toBeNull();
});

test('preserves accessible names, refs, native props, events, and render composition', async () => {
  const rootRef = createRef<HTMLDivElement>();
  const buttonRef = createRef<HTMLButtonElement>();
  const onClick = vi.fn();

  await render(
    <TRToolbar.Root aria-label="Editor controls" data-editor="document" ref={rootRef}>
      <TRToolbar.Group aria-label="Document commands">
        <TRToolbar.Button
          className="consumer-command"
          name="command"
          onClick={onClick}
          ref={buttonRef}
          value="save"
        >
          Save
        </TRToolbar.Button>
        <TRToolbar.Button nativeButton={false} render={<a href="#preview" />}>
          Preview
        </TRToolbar.Button>
      </TRToolbar.Group>
    </TRToolbar.Root>,
  );

  const toolbar = page.getByRole('toolbar', { name: 'Editor controls' });
  const group = page.getByRole('group', { name: 'Document commands' });
  const save = page.getByRole('button', { name: 'Save' });
  const preview = page.getByRole('button', { name: 'Preview' });
  expect(rootRef.current).toBe(toolbar.element());
  expect(rootRef.current?.dataset['editor']).toBe('document');
  expect(buttonRef.current).toBe(save.element());
  expect(buttonRef.current?.name).toBe('command');
  expect(buttonRef.current?.value).toBe('save');
  expect(group.element()).toHaveClass('tr-toolbar-group');
  expect(save.element()).toHaveClass('tr-toolbar-button', 'consumer-command');
  expect(preview.element()).toHaveClass('tr-toolbar-button');
  expect(preview.element().tagName).toBe('A');
  expect(preview.element().getAttribute('href')).toBe('#preview');
  await userEvent.click(save);
  expect(onClick).toHaveBeenCalledOnce();
});

test('styles a focusable disabled item without hiding it from toolbar focus', async () => {
  await render(
    <TRToolbar.Root aria-label="Editor">
      <TRToolbar.Button>Bold</TRToolbar.Button>
      <TRToolbar.Button disabled focusableWhenDisabled>
        Underline
      </TRToolbar.Button>
    </TRToolbar.Root>,
  );

  const enabled = Array.from(document.querySelectorAll('button')).find(
    (button) => button.textContent === 'Bold',
  );
  const disabled = Array.from(document.querySelectorAll('button')).find(
    (button) => button.textContent === 'Underline',
  );

  expect(disabled?.hasAttribute('data-disabled')).toBe(true);
  expect(disabled?.getAttribute('aria-disabled')).toBe('true');
  expect(
    Number.parseFloat(getComputedStyle(disabled as HTMLElement).opacity),
  ).toBeLessThan(Number.parseFloat(getComputedStyle(enabled as HTMLElement).opacity));
});

test('moves roving focus across groups while preserving input editing keys', async () => {
  await render(
    <TRToolbar.Root aria-label="Editor" loopFocus={false}>
      <TRToolbar.Group aria-label="Formatting">
        <TRToolbar.Button>Bold</TRToolbar.Button>
        <TRToolbar.Button>Italic</TRToolbar.Button>
      </TRToolbar.Group>
      <TRToolbar.Link href="#help">Help</TRToolbar.Link>
      <TRToolbar.Input aria-label="Document title" />
    </TRToolbar.Root>,
  );

  const bold = page.getByRole('button', { name: 'Bold' });
  const italic = page.getByRole('button', { name: 'Italic' });
  const help = page.getByRole('link', { name: 'Help' });
  const input = page.getByRole('textbox', { name: 'Document title' });
  bold.element().focus();
  await userEvent.keyboard('{ArrowLeft}');
  expect(document.activeElement).toBe(bold.element());
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(italic.element());
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(help.element());
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(input.element());

  await userEvent.keyboard('Rack Alpha');
  await userEvent.keyboard('{ArrowLeft}');
  expect(document.activeElement).toBe(input.element());
  expect((input.element() as HTMLInputElement).value).toBe('Rack Alpha');
});

test('aligns vertical groups with Up/Down navigation and loops by default', async () => {
  await render(
    <TRToolbar.Root aria-label="Block controls" orientation="vertical">
      <TRToolbar.Group aria-label="Block alignment">
        <TRToolbar.Button>Move up</TRToolbar.Button>
        <TRToolbar.Button>Move down</TRToolbar.Button>
      </TRToolbar.Group>
    </TRToolbar.Root>,
  );

  const toolbar = page.getByRole('toolbar', { name: 'Block controls' });
  const group = page.getByRole('group', { name: 'Block alignment' });
  const moveUp = page.getByRole('button', { name: 'Move up' });
  const moveDown = page.getByRole('button', { name: 'Move down' });
  expect(toolbar.element().getAttribute('aria-orientation')).toBe('vertical');
  expect(getComputedStyle(group.element()).flexDirection).toBe('column');
  moveUp.element().focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(document.activeElement).toBe(moveDown.element());
  await userEvent.keyboard('{ArrowDown}');
  expect(document.activeElement).toBe(moveUp.element());
});

test('focuses disabled discoverable items without activating them', async () => {
  const onDisabledClick = vi.fn();

  await render(
    <TRToolbar.Root aria-label="Editor">
      <TRToolbar.Button>Bold</TRToolbar.Button>
      <TRToolbar.Button disabled focusableWhenDisabled onClick={onDisabledClick}>
        Underline
      </TRToolbar.Button>
    </TRToolbar.Root>,
  );

  const bold = page.getByRole('button', { name: 'Bold' });
  const underline = page.getByRole('button', { name: 'Underline' });
  bold.element().focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(underline.element());
  await userEvent.keyboard('{Enter}');
  expect(onDisabledClick).not.toHaveBeenCalled();
});

test('propagates disabled root and group state without activating commands', async () => {
  const onRootCommand = vi.fn();
  const onGroupCommand = vi.fn();

  await render(
    <>
      <TRToolbar.Root aria-label="Disabled editor" disabled>
        <TRToolbar.Group aria-label="Disabled root commands">
          <TRToolbar.Button onClick={onRootCommand}>Save</TRToolbar.Button>
          <TRToolbar.Input aria-label="Disabled title" />
        </TRToolbar.Group>
      </TRToolbar.Root>
      <TRToolbar.Root aria-label="History editor">
        <TRToolbar.Group aria-label="Disabled history commands" disabled>
          <TRToolbar.Button onClick={onGroupCommand}>Undo</TRToolbar.Button>
        </TRToolbar.Group>
      </TRToolbar.Root>
    </>,
  );

  const disabledRoot = page.getByRole('toolbar', { name: 'Disabled editor' });
  const disabledRootGroup = page.getByRole('group', { name: 'Disabled root commands' });
  const disabledGroup = page.getByRole('group', { name: 'Disabled history commands' });
  const save = page.getByRole('button', { name: 'Save' });
  const undo = page.getByRole('button', { name: 'Undo' });
  const input = page.getByRole('textbox', { name: 'Disabled title' });
  expect(disabledRoot.element()).toHaveAttribute('data-disabled');
  expect(disabledRootGroup.element()).toHaveAttribute('data-disabled');
  expect(disabledGroup.element()).toHaveAttribute('data-disabled');
  expect(save.element()).toHaveAttribute('aria-disabled', 'true');
  expect(undo.element()).toHaveAttribute('aria-disabled', 'true');
  expect(input.element()).toHaveAttribute('aria-disabled', 'true');
  expect(getComputedStyle(disabledRoot.element()).opacity).toBe('0.5');
  expect(getComputedStyle(disabledRootGroup.element()).opacity).toBe('1');
  expect(getComputedStyle(disabledGroup.element()).opacity).toBe('0.5');
  expect(getComputedStyle(undo.element()).opacity).toBe('1');
  (save.element() as HTMLButtonElement).click();
  (undo.element() as HTMLButtonElement).click();
  expect(onRootCommand).not.toHaveBeenCalled();
  expect(onGroupCommand).not.toHaveBeenCalled();
});

test('applies semantic hover feedback to enabled buttons and links', async () => {
  await render(
    <div data-theme="tinyrack-light">
      <TRToolbar.Root aria-label="Editor">
        <TRToolbar.Button>Save</TRToolbar.Button>
        <TRToolbar.Link href="#help">Help</TRToolbar.Link>
      </TRToolbar.Root>
      <span
        data-testid="hover-color"
        style={{ backgroundColor: 'var(--tinyrack-surface-hover)' }}
      />
    </div>,
  );

  const save = page.getByRole('button', { name: 'Save' });
  const help = page.getByRole('link', { name: 'Help' });
  const hoverColor = getComputedStyle(
    page.getByTestId('hover-color').element(),
  ).backgroundColor;
  await userEvent.hover(save);
  await expect
    .poll(() => getComputedStyle(save.element()).backgroundColor)
    .toBe(hoverColor);
  await userEvent.hover(help);
  await expect
    .poll(() => getComputedStyle(help.element()).backgroundColor)
    .toBe(hoverColor);
});

test('sizes separators from their own orientation instead of the toolbar orientation', async () => {
  await render(
    <>
      <TRToolbar.Root aria-label="Horizontal editor" orientation="horizontal">
        <TRToolbar.Button>Bold</TRToolbar.Button>
        <TRToolbar.Separator orientation="horizontal" />
      </TRToolbar.Root>
      <TRToolbar.Root aria-label="Vertical editor" orientation="vertical">
        <TRToolbar.Button>Italic</TRToolbar.Button>
        <TRToolbar.Separator orientation="vertical" />
      </TRToolbar.Root>
    </>,
  );

  const [horizontal, vertical] = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-toolbar-separator'),
  );
  expect(horizontal?.dataset['orientation']).toBe('horizontal');
  expect(horizontal?.getBoundingClientRect().height).toBe(1);
  expect(horizontal?.getBoundingClientRect().width).toBeGreaterThan(1);
  expect(vertical?.dataset['orientation']).toBe('vertical');
  expect(vertical?.getBoundingClientRect().width).toBe(1);
  expect(vertical?.getBoundingClientRect().height).toBeGreaterThan(1);
});

test('32 renders compact icon-toolbar geometry while preserving named commands', async () => {
  await render(
    <TRToolbar.Root aria-label="Formatting">
      <TRToolbar.Group aria-label="Text style">
        <TRToolbar.Button aria-label="Bold">
          <svg aria-hidden="true" />
        </TRToolbar.Button>
        <TRToolbar.Button aria-label="Italic">
          <svg aria-hidden="true" />
        </TRToolbar.Button>
      </TRToolbar.Group>
      <TRToolbar.Separator orientation="vertical" />
      <TRToolbar.Button aria-label="Underline" disabled>
        <svg aria-hidden="true" />
      </TRToolbar.Button>
    </TRToolbar.Root>,
  );
  const bold = page.getByRole('button', { name: 'Bold' }).element();
  const root = document.querySelector<HTMLElement>('.tr-toolbar');
  expect(bold.getBoundingClientRect().width).toBe(32);
  expect(bold.getBoundingClientRect().height).toBe(32);
  expect(getComputedStyle(bold).borderTopColor).toBe('rgba(0, 0, 0, 0)');
  expect(getComputedStyle(root as HTMLElement).borderTopColor).not.toBe(
    getComputedStyle(bold).borderTopColor,
  );
  bold.focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement?.getAttribute('aria-label')).toBe('Italic');
});

test('forwards every part ref, style, native event, and input form value', async () => {
  const groupRef = createRef<HTMLDivElement>();
  const linkRef = createRef<HTMLAnchorElement>();
  const inputRef = createRef<HTMLInputElement>();
  const separatorRef = createRef<HTMLDivElement>();
  const onGroupPointerDown = vi.fn();
  const onLinkClick = vi.fn();
  const onInputChange = vi.fn();

  await render(
    <form>
      <TRToolbar.Root aria-label="Document editor">
        <TRToolbar.Group
          aria-label="Document actions"
          onPointerDown={onGroupPointerDown}
          ref={groupRef}
          style={{ gap: '7px' }}
        >
          <TRToolbar.Button name="intent" value="save">
            Save
          </TRToolbar.Button>
        </TRToolbar.Group>
        <TRToolbar.Separator data-divider="actions" ref={separatorRef} />
        <TRToolbar.Link
          href="/help"
          onClick={(event) => {
            event.preventDefault();
            onLinkClick();
          }}
          ref={linkRef}
        >
          Help
        </TRToolbar.Link>
        <TRToolbar.Input
          defaultValue="Rack Alpha"
          name="title"
          onChange={onInputChange}
          ref={inputRef}
        />
      </TRToolbar.Root>
    </form>,
  );

  expect(groupRef.current).toHaveClass('tr-toolbar-group');
  expect(groupRef.current?.style.gap).toBe('7px');
  expect(linkRef.current).toHaveClass('tr-toolbar-link');
  expect(separatorRef.current).toHaveClass('tr-toolbar-separator');
  expect(separatorRef.current?.dataset['divider']).toBe('actions');
  expect(inputRef.current).toHaveClass('tr-toolbar-input');
  expect(
    new FormData(document.querySelector('form') as HTMLFormElement).get('title'),
  ).toBe('Rack Alpha');

  await userEvent.click(groupRef.current as HTMLDivElement);
  await userEvent.click(linkRef.current as HTMLAnchorElement);
  await userEvent.clear(inputRef.current as HTMLInputElement);
  await userEvent.type(inputRef.current as HTMLInputElement, 'Rack Beta');
  expect(onGroupPointerDown).toHaveBeenCalled();
  expect(onLinkClick).toHaveBeenCalledOnce();
  expect(onInputChange).toHaveBeenCalled();
});

test('skips non-focusable disabled items and keeps links navigable in disabled groups', async () => {
  const onLinkClick = vi.fn();

  await render(
    <TRToolbar.Root aria-label="Editor">
      <TRToolbar.Button>Bold</TRToolbar.Button>
      <TRToolbar.Group aria-label="Unavailable commands" disabled>
        <TRToolbar.Button disabled focusableWhenDisabled={false}>
          Italic
        </TRToolbar.Button>
        <TRToolbar.Input aria-label="Unavailable title" focusableWhenDisabled={false} />
        <TRToolbar.Link
          href="/help"
          onClick={(event) => {
            event.preventDefault();
            onLinkClick();
          }}
        >
          Help
        </TRToolbar.Link>
      </TRToolbar.Group>
    </TRToolbar.Root>,
  );

  const bold = page.getByRole('button', { name: 'Bold' });
  const help = page.getByRole('link', { name: 'Help' });
  bold.element().focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(help.element());
  await userEvent.keyboard('{Enter}');
  expect(onLinkClick).toHaveBeenCalledOnce();
});

test('server-renders and hydrates the complete toolbar without recovery', async () => {
  const fixture = (
    <TRToolbar.Root aria-label="Hydrated editor" orientation="vertical">
      <TRToolbar.Group aria-label="Formatting">
        <TRToolbar.Button>Bold</TRToolbar.Button>
      </TRToolbar.Group>
      <TRToolbar.Separator />
      <TRToolbar.Link href="#help">Help</TRToolbar.Link>
      <TRToolbar.Input aria-label="Title" defaultValue="Rack Alpha" />
    </TRToolbar.Root>
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
  expect(host.querySelector('[role="toolbar"]')).toHaveAttribute(
    'aria-orientation',
    'vertical',
  );
  expect(host.querySelector('.tr-toolbar-separator')).toHaveAttribute(
    'data-orientation',
    'horizontal',
  );
  const bold = host.querySelector<HTMLButtonElement>('button');
  bold?.focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(document.activeElement).toBe(host.querySelector('a'));

  await act(async () => root.unmount());
  host.remove();
});
