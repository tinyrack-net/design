import '../../core/core.css';
import './copy-button.css';
import type { ComponentProps } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { CopyButton } from './index.js';

test('copies with Clipboard API, announces success, and resets', async () => {
  vi.useFakeTimers();
  const writeText = vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockResolvedValue(undefined);
  const onStatusChange = vi.fn();
  await render(
    <CopyButton
      copiedLabel="Copied source"
      onStatusChange={onStatusChange}
      resetDelay={50}
      value="pnpm add @tinyrack/ui"
    />,
  );
  const button = document.querySelector<HTMLButtonElement>('.tr-btn');
  const idleWidth = button?.getBoundingClientRect().width;
  button?.click();
  await vi.waitFor(() => expect(button?.dataset['copyStatus']).toBe('copied'));
  expect(writeText).toHaveBeenCalledWith('pnpm add @tinyrack/ui');
  expect(button?.textContent).toContain('Copied source');
  expect(button?.getBoundingClientRect().width).toBe(idleWidth);
  expect(onStatusChange).toHaveBeenCalledWith('copied');
  await vi.advanceTimersByTimeAsync(50);
  expect(button?.dataset['copyStatus']).toBe('idle');
  expect(onStatusChange).toHaveBeenCalledWith('idle');
  vi.useRealTimers();
  writeText.mockRestore();
});

test('restarts its reset timer after repeated copy actions', async () => {
  const writeText = vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockResolvedValue(undefined);
  const onStatusChange = vi.fn();
  const view = await render(
    <CopyButton onStatusChange={onStatusChange} resetDelay={10_000} value="repeat" />,
  );
  const button = document.querySelector<HTMLButtonElement>(
    '.tr-btn',
  ) as HTMLButtonElement;
  await userEvent.click(button);
  await expect.poll(() => onStatusChange.mock.calls.length).toBe(1);
  await userEvent.click(button);
  await expect.poll(() => onStatusChange.mock.calls.length).toBe(2);
  expect(writeText).toHaveBeenCalledTimes(2);
  await view.unmount();
  writeText.mockRestore();
});

test('falls back to selection copying after Clipboard API rejection', async () => {
  const execCommand = vi.fn(() => true);
  Object.defineProperty(document, 'execCommand', {
    configurable: true,
    value: execCommand,
  });
  const selected = document.createElement('span');
  selected.textContent = 'Existing selection';
  document.body.append(selected);
  const selection = document.getSelection();
  const range = document.createRange();
  range.selectNodeContents(selected);
  const writeText = vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockImplementation(() => {
      selection?.removeAllRanges();
      selection?.addRange(range);
      return Promise.reject(new Error('denied'));
    });
  await render(<CopyButton value="fallback value" />);
  const button = document.querySelector<HTMLButtonElement>(
    '.tr-btn',
  ) as HTMLButtonElement;
  await userEvent.click(button);
  await expect
    .poll(
      () => document.querySelector<HTMLButtonElement>('.tr-btn')?.dataset['copyStatus'],
    )
    .toBe('copied');
  expect(execCommand).toHaveBeenCalledWith('copy');
  expect(document.querySelector('body > textarea')).toBeNull();
  expect(selection?.toString()).toBe('Existing selection');
  expect(document.activeElement).toBe(button);
  selection?.removeAllRanges();
  selected.remove();
  writeText.mockRestore();
});

test('falls back after a Clipboard API timeout', async () => {
  vi.useFakeTimers();
  const writeText = vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockImplementation(() => new Promise(() => {}));
  Object.defineProperty(document, 'execCommand', {
    configurable: true,
    value: vi.fn(() => true),
  });
  await render(<CopyButton value="timeout fallback" />);
  document.querySelector<HTMLButtonElement>('.tr-btn')?.click();
  await vi.advanceTimersByTimeAsync(1_000);
  await vi.waitFor(() =>
    expect(
      document.querySelector<HTMLButtonElement>('.tr-btn')?.dataset['copyStatus'],
    ).toBe('copied'),
  );
  writeText.mockRestore();
  vi.useRealTimers();
});

test('handles an unavailable Clipboard API without a document selection', async () => {
  const clipboard = navigator.clipboard;
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: undefined,
  });
  const getSelection = vi.spyOn(document, 'getSelection').mockReturnValue(null);
  Object.defineProperty(document, 'execCommand', {
    configurable: true,
    value: vi.fn(() => false),
  });
  await render(<CopyButton value="unavailable" />);
  document.querySelector<HTMLButtonElement>('.tr-btn')?.click();
  await expect
    .poll(
      () => document.querySelector<HTMLButtonElement>('.tr-btn')?.dataset['copyStatus'],
    )
    .toBe('unavailable');
  getSelection.mockRestore();
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: clipboard,
  });
});

test('falls back safely when the document has no active HTML element', async () => {
  const clipboard = navigator.clipboard;
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: undefined,
  });
  const getSelection = vi.spyOn(document, 'getSelection').mockReturnValue(null);
  Object.defineProperty(document, 'execCommand', {
    configurable: true,
    value: undefined,
  });

  await render(
    <>
      <svg aria-label="SVG focus container" role="img">
        <a aria-label="SVG focus target" href="#svg-focus-target">
          <text>SVG focus target</text>
        </a>
      </svg>
      <CopyButton value="no active element" />
    </>,
  );
  const svgLink = document.querySelector<SVGAElement>('svg a');
  svgLink?.focus();
  expect(document.activeElement).toBe(svgLink);
  document.querySelector<HTMLButtonElement>('.tr-btn')?.click();
  await expect
    .poll(
      () => document.querySelector<HTMLButtonElement>('.tr-btn')?.dataset['copyStatus'],
    )
    .toBe('unavailable');

  getSelection.mockRestore();
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: clipboard,
  });
});

test('reports unavailable when both copy strategies fail and respects cancellation', async () => {
  const writeText = vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockRejectedValue(new Error('denied'));
  Object.defineProperty(document, 'execCommand', {
    configurable: true,
    value: vi.fn(() => false),
  });
  const onClick = vi.fn(
    (event: Parameters<NonNullable<ComponentProps<typeof CopyButton>['onClick']>>[0]) =>
      event.preventDefault(),
  );
  const view = await render(
    <CopyButton unavailableLabel="Unavailable" value="value" />,
  );
  await userEvent.click(
    document.querySelector<HTMLButtonElement>('.tr-btn') as HTMLButtonElement,
  );
  await expect
    .poll(
      () => document.querySelector<HTMLButtonElement>('.tr-btn')?.dataset['copyStatus'],
    )
    .toBe('unavailable');
  expect(document.querySelector<HTMLButtonElement>('.tr-btn')?.textContent).toContain(
    'Unavailable',
  );

  await view.unmount();
  await render(<CopyButton onClick={onClick} value="cancelled" />);
  await userEvent.click(
    document.querySelector<HTMLButtonElement>('.tr-btn') as HTMLButtonElement,
  );
  expect(onClick).toHaveBeenCalledOnce();
  expect(
    document.querySelector<HTMLButtonElement>('.tr-btn')?.dataset['copyStatus'],
  ).toBe('idle');
  writeText.mockRestore();
});

test('01 keeps inactive status labels out of the intrinsic button width', async () => {
  await render(
    <CopyButton
      copiedLabel="Copied"
      idleLabel="Copy"
      unavailableLabel="Copy unavailable"
      value="rack-id"
    />,
  );

  const button = document.querySelector<HTMLButtonElement>('button[data-copy-status]');
  const unavailable = button?.querySelector<HTMLElement>(
    '[data-copy-label="unavailable"]',
  );
  expect(button).not.toBeNull();
  expect(unavailable).not.toBeNull();
  expect((button as HTMLButtonElement).getBoundingClientRect().width).toBeLessThan(96);
});
