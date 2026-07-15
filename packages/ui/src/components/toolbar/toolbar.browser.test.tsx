import '../../core/core.css';
import './toolbar.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Toolbar, ToolbarRoot } from './index.js';

test('renders the Tinyrack Toolbar wrapper', async () => {
  expect(Toolbar.Root).toBe(ToolbarRoot);
  await render(
    <Toolbar.Root aria-label="Editor">
      <Toolbar.Group aria-label="Formatting">
        <Toolbar.Button>Bold</Toolbar.Button>
      </Toolbar.Group>
    </Toolbar.Root>,
  );
  expect(document.querySelector('.tr-toolbar')).not.toBeNull();
});

test('preserves accessible names, refs, native props, events, and render composition', async () => {
  const rootRef = createRef<HTMLDivElement>();
  const buttonRef = createRef<HTMLButtonElement>();
  const onClick = vi.fn();

  await render(
    <Toolbar.Root aria-label="Editor controls" data-editor="document" ref={rootRef}>
      <Toolbar.Group aria-label="Document commands">
        <Toolbar.Button
          className="consumer-command"
          name="command"
          onClick={onClick}
          ref={buttonRef}
          value="save"
        >
          Save
        </Toolbar.Button>
        <Toolbar.Button nativeButton={false} render={<a href="#preview" />}>
          Preview
        </Toolbar.Button>
      </Toolbar.Group>
    </Toolbar.Root>,
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
    <Toolbar.Root aria-label="Editor">
      <Toolbar.Button>Bold</Toolbar.Button>
      <Toolbar.Button disabled focusableWhenDisabled>
        Underline
      </Toolbar.Button>
    </Toolbar.Root>,
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
    <Toolbar.Root aria-label="Editor" loopFocus={false}>
      <Toolbar.Group aria-label="Formatting">
        <Toolbar.Button>Bold</Toolbar.Button>
        <Toolbar.Button>Italic</Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Link href="#help">Help</Toolbar.Link>
      <Toolbar.Input aria-label="Document title" />
    </Toolbar.Root>,
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
    <Toolbar.Root aria-label="Block controls" orientation="vertical">
      <Toolbar.Group aria-label="Block alignment">
        <Toolbar.Button>Move up</Toolbar.Button>
        <Toolbar.Button>Move down</Toolbar.Button>
      </Toolbar.Group>
    </Toolbar.Root>,
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
    <Toolbar.Root aria-label="Editor">
      <Toolbar.Button>Bold</Toolbar.Button>
      <Toolbar.Button disabled focusableWhenDisabled onClick={onDisabledClick}>
        Underline
      </Toolbar.Button>
    </Toolbar.Root>,
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
      <Toolbar.Root aria-label="Disabled editor" disabled>
        <Toolbar.Group aria-label="Disabled root commands">
          <Toolbar.Button onClick={onRootCommand}>Save</Toolbar.Button>
          <Toolbar.Input aria-label="Disabled title" />
        </Toolbar.Group>
      </Toolbar.Root>
      <Toolbar.Root aria-label="History editor">
        <Toolbar.Group aria-label="Disabled history commands" disabled>
          <Toolbar.Button onClick={onGroupCommand}>Undo</Toolbar.Button>
        </Toolbar.Group>
      </Toolbar.Root>
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
      <Toolbar.Root aria-label="Editor">
        <Toolbar.Button>Save</Toolbar.Button>
        <Toolbar.Link href="#help">Help</Toolbar.Link>
      </Toolbar.Root>
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
      <Toolbar.Root aria-label="Horizontal editor" orientation="horizontal">
        <Toolbar.Button>Bold</Toolbar.Button>
        <Toolbar.Separator orientation="horizontal" />
      </Toolbar.Root>
      <Toolbar.Root aria-label="Vertical editor" orientation="vertical">
        <Toolbar.Button>Italic</Toolbar.Button>
        <Toolbar.Separator orientation="vertical" />
      </Toolbar.Root>
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
    <Toolbar.Root aria-label="Formatting">
      <Toolbar.Group aria-label="Text style">
        <Toolbar.Button aria-label="Bold">
          <svg aria-hidden="true" />
        </Toolbar.Button>
        <Toolbar.Button aria-label="Italic">
          <svg aria-hidden="true" />
        </Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator orientation="vertical" />
      <Toolbar.Button aria-label="Underline" disabled>
        <svg aria-hidden="true" />
      </Toolbar.Button>
    </Toolbar.Root>,
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
