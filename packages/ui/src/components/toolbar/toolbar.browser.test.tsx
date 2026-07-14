import '../../core/core.css';
import './toolbar.css';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Toolbar, ToolbarRoot } from './index.js';

test('renders the Tinyrack Toolbar wrapper', async () => {
  expect(Toolbar.Root).toBe(ToolbarRoot);
  await render(
    <Toolbar.Root aria-label="Editor">
      <Toolbar.Group>
        <Toolbar.Button>Bold</Toolbar.Button>
      </Toolbar.Group>
    </Toolbar.Root>,
  );
  expect(document.querySelector('.tr-toolbar')).not.toBeNull();
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
      <Toolbar.Input aria-label="Document title" />
      <Toolbar.Link href="#help">Help</Toolbar.Link>
    </Toolbar.Root>,
  );

  const bold = page.getByRole('button', { name: 'Bold' });
  const italic = page.getByRole('button', { name: 'Italic' });
  const input = page.getByRole('textbox', { name: 'Document title' });
  bold.element().focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(italic.element());
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(input.element());

  await userEvent.keyboard('Rack Alpha');
  await userEvent.keyboard('{ArrowLeft}');
  expect(document.activeElement).toBe(input.element());
  expect((input.element() as HTMLInputElement).value).toBe('Rack Alpha');
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
