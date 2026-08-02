import '../../core/core.css';
import './copy-button.css';
import { type ComponentProps, createRef } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRCopyButton } from './index.js';

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

test('copies with Clipboard API, announces success, and resets', async () => {
  vi.useFakeTimers();
  const writeText = vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockResolvedValue(undefined);
  const onStatusChange = vi.fn();
  await render(
    <TRCopyButton
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
  vi.useFakeTimers();
  const writeText = vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockResolvedValue(undefined);
  const onStatusChange = vi.fn();
  const view = await render(
    <TRCopyButton onStatusChange={onStatusChange} resetDelay={10_000} value="repeat" />,
  );
  const button = document.querySelector<HTMLButtonElement>(
    '.tr-btn',
  ) as HTMLButtonElement;
  button.click();
  await vi.waitFor(() => expect(button.dataset['copyStatus']).toBe('copied'));
  await vi.advanceTimersByTimeAsync(5_000);

  button.click();
  await vi.waitFor(() => expect(onStatusChange).toHaveBeenCalledTimes(2));

  await vi.advanceTimersByTimeAsync(5_000);
  expect(button.dataset['copyStatus']).toBe('copied');
  await vi.advanceTimersToNextTimerAsync();
  await vi.waitFor(() => expect(button.dataset['copyStatus']).toBe('idle'));
  expect(writeText).toHaveBeenCalledTimes(2);
  await view.unmount();
  vi.useRealTimers();
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
  await render(<TRCopyButton value="fallback value" />);
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
  await render(<TRCopyButton value="timeout fallback" />);
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
  await render(<TRCopyButton value="unavailable" />);
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
      <TRCopyButton value="no active element" />
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
    (
      event: Parameters<NonNullable<ComponentProps<typeof TRCopyButton>['onClick']>>[0],
    ) => event.preventDefault(),
  );
  const view = await render(
    <TRCopyButton unavailableLabel="Unavailable" value="value" />,
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
  await render(<TRCopyButton onClick={onClick} value="cancelled" />);
  await userEvent.click(
    document.querySelector<HTMLButtonElement>('.tr-btn') as HTMLButtonElement,
  );
  expect(onClick).toHaveBeenCalledOnce();
  expect(
    document.querySelector<HTMLButtonElement>('.tr-btn')?.dataset['copyStatus'],
  ).toBe('idle');
  writeText.mockRestore();
});

test('reports unavailable when the selection copy command throws', async () => {
  const writeText = vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockRejectedValue(new Error('denied'));
  Object.defineProperty(document, 'execCommand', {
    configurable: true,
    value: vi.fn(() => {
      throw new Error('copy blocked');
    }),
  });
  await render(<TRCopyButton value="blocked" />);

  document.querySelector<HTMLButtonElement>('.tr-btn')?.click();

  await expect
    .poll(
      () => document.querySelector<HTMLButtonElement>('.tr-btn')?.dataset['copyStatus'],
    )
    .toBe('unavailable');
  writeText.mockRestore();
});

test('ignores an older clipboard result after a newer copy succeeds', async () => {
  let rejectFirst!: (reason: Error) => void;
  let resolveSecond!: () => void;
  const firstWrite = new Promise<void>((_, reject) => {
    rejectFirst = reject;
  });
  const secondWrite = new Promise<void>((resolve) => {
    resolveSecond = resolve;
  });
  const writeText = vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockReturnValueOnce(firstWrite)
    .mockReturnValueOnce(secondWrite);
  Object.defineProperty(document, 'execCommand', {
    configurable: true,
    value: vi.fn(() => false),
  });
  const onStatusChange = vi.fn();
  await render(<TRCopyButton onStatusChange={onStatusChange} value="latest" />);
  const button = document.querySelector<HTMLButtonElement>('.tr-btn');

  button?.click();
  button?.click();
  resolveSecond();
  await vi.waitFor(() => expect(button?.dataset['copyStatus']).toBe('copied'));
  rejectFirst(new Error('older request failed'));
  await vi.waitFor(() => expect(document.execCommand).toHaveBeenCalledWith('copy'));

  expect(button?.dataset['copyStatus']).toBe('copied');
  expect(onStatusChange).toHaveBeenCalledTimes(1);
  writeText.mockRestore();
});

test('does not report a pending clipboard result after unmount', async () => {
  let resolveWrite!: () => void;
  const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockReturnValue(
    new Promise<void>((resolve) => {
      resolveWrite = resolve;
    }),
  );
  const onStatusChange = vi.fn();
  const view = await render(
    <TRCopyButton onStatusChange={onStatusChange} value="pending" />,
  );

  document.querySelector<HTMLButtonElement>('.tr-btn')?.click();
  await vi.waitFor(() => expect(writeText).toHaveBeenCalledOnce());
  await view.unmount();
  resolveWrite();
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(onStatusChange).not.toHaveBeenCalled();
  writeText.mockRestore();
});

test('preserves refs, native props, keyboard activation, and inherited visual states', async () => {
  const ref = createRef<HTMLButtonElement>();
  const writeText = vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockResolvedValue(undefined);
  const screen = await render(
    <TRCopyButton
      aria-describedby="copy-help"
      appearance="ghost"
      className="consumer-copy"
      data-consumer="preserved"
      ref={ref}
      style={{ minWidth: '10rem' }}
      uiSize="lg"
      value="keyboard value"
      variant="primary"
    />,
  );
  const button = screen.getByRole('button', { name: 'Copy' });

  expect(ref.current).toBe(button.element());
  expect(ref.current?.classList).toContain('consumer-copy');
  expect(ref.current?.dataset['consumer']).toBe('preserved');
  expect(ref.current?.dataset['appearance']).toBe('ghost');
  expect(ref.current?.dataset['uiSize']).toBe('lg');
  expect(ref.current?.dataset['variant']).toBe('primary');
  expect(ref.current?.style.minWidth).toBe('10rem');
  await userEvent.type(button, '{Enter}');
  await expect.poll(() => ref.current?.dataset['copyStatus']).toBe('copied');
  expect(ref.current?.querySelector('[aria-live="polite"]')?.textContent).toBe(
    'Copied',
  );
  await expect.element(button).toHaveFocus();
  writeText.mockRestore();
});

test('inherits disabled and loading behavior without copying', async () => {
  const writeText = vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockResolvedValue(undefined);
  await render(
    <>
      <TRCopyButton disabled value="disabled" />
      <TRCopyButton loading loadingLabel="Copying source" value="loading" />
    </>,
  );
  const [disabled, loading] = Array.from(
    document.querySelectorAll<HTMLButtonElement>('.tr-btn'),
  );

  expect(disabled?.disabled).toBe(true);
  expect(loading?.disabled).toBe(true);
  expect(loading?.getAttribute('aria-busy')).toBe('true');
  expect(loading?.getAttribute('aria-label')).toBe('Copying source');
  disabled?.click();
  loading?.click();
  expect(writeText).not.toHaveBeenCalled();
  writeText.mockRestore();
});

test('01 keeps inactive status labels out of the intrinsic button width', async () => {
  await render(
    <TRCopyButton
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

test('keeps status labels inside a right-aligned overflow boundary', async () => {
  const writeText = vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockRejectedValue(new Error('denied'));
  Object.defineProperty(document, 'execCommand', {
    configurable: true,
    value: vi.fn(() => false),
  });
  await render(
    <div
      data-copy-overflow-boundary=""
      style={{ height: '3rem', overflow: 'auto', position: 'relative', width: '200px' }}
    >
      <TRCopyButton
        idleLabel="Copy"
        style={{ position: 'absolute', right: 0 }}
        unavailableLabel="Copy unavailable"
        value="rack-id"
      />
    </div>,
  );

  const boundary = document.querySelector<HTMLElement>('[data-copy-overflow-boundary]');
  expect(boundary).not.toBeNull();
  expect((boundary as HTMLElement).scrollWidth).toBe(
    (boundary as HTMLElement).clientWidth,
  );

  await userEvent.click(
    document.querySelector<HTMLButtonElement>('.tr-btn') as HTMLButtonElement,
  );
  await expect
    .poll(
      () => document.querySelector<HTMLButtonElement>('.tr-btn')?.dataset['copyStatus'],
    )
    .toBe('unavailable');
  expect((boundary as HTMLElement).scrollWidth).toBe(
    (boundary as HTMLElement).clientWidth,
  );
  writeText.mockRestore();
});
