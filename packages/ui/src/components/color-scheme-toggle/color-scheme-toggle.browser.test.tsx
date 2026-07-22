import '../../core/core.css';
import './color-scheme-toggle.css';
import { act, createRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRColorSchemeToggle } from './index.js';

test('is controlled, forwards its ref, and announces the next scheme', async () => {
  const ref = createRef<HTMLButtonElement>();
  function Fixture() {
    const [value, setValue] = useState<'dark' | 'light'>('dark');
    return (
      <TRColorSchemeToggle
        className="custom-toggle"
        onValueChange={setValue}
        ref={ref}
        uiSize="sm"
        value={value}
      />
    );
  }
  await render(<Fixture />);
  expect(ref.current).toHaveClass('tr-color-scheme-toggle', 'custom-toggle');
  expect(ref.current).toHaveAttribute('aria-label', 'Use light color scheme');
  expect(ref.current).toHaveAttribute('aria-pressed', 'true');
  const icon = ref.current?.querySelector(
    '.tr-color-scheme-toggle-icon',
  ) as HTMLElement;
  expect(icon.tagName).toBe('svg');
  expect(icon).toHaveClass('tr-color-scheme-toggle-icon');
  await userEvent.click(ref.current as HTMLButtonElement);
  expect(ref.current).toHaveAttribute('aria-label', 'Use dark color scheme');
  expect(ref.current).toHaveAttribute('aria-pressed', 'false');
  expect(ref.current?.querySelector('.tr-color-scheme-toggle-icon')).toBeInstanceOf(
    SVGElement,
  );
  expect(getComputedStyle(ref.current as HTMLButtonElement).display).toBe(
    'inline-flex',
  );
});

test('supports localized labels and a disabled controlled state', async () => {
  const onValueChange = vi.fn();
  await render(
    <TRColorSchemeToggle
      darkLabel="다크 모드"
      disabled
      lightLabel="라이트 모드"
      onValueChange={onValueChange}
      value="light"
    />,
  );
  const button = document.querySelector('button') as HTMLButtonElement;
  expect(button).toHaveAttribute('aria-label', '다크 모드');
  button.click();
  expect(onValueChange).not.toHaveBeenCalled();
});

test('preserves native props and composes cancellable click events', async () => {
  const onFocus = vi.fn();
  const onClick = vi.fn((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  });
  const onValueChange = vi.fn();
  await render(
    <TRColorSchemeToggle
      data-testid="scheme-toggle"
      onClick={onClick}
      onFocus={onFocus}
      onValueChange={onValueChange}
      style={{ marginTop: '7px' }}
      title="Application color scheme"
      value="light"
    />,
  );
  const button = document.querySelector('button') as HTMLButtonElement;

  expect(button).toHaveAttribute('data-testid', 'scheme-toggle');
  expect(button).toHaveAttribute('title', 'Application color scheme');
  expect(button.style.marginTop).toBe('7px');
  button.focus();
  expect(onFocus).toHaveBeenCalledOnce();
  await userEvent.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledOnce();
  expect(onValueChange).not.toHaveBeenCalled();
});

test('supports external accessible naming and keyboard activation without losing focus', async () => {
  const onValueChange = vi.fn();
  await render(
    <div>
      <span id="scheme-label">Change the application color scheme</span>
      <TRColorSchemeToggle
        aria-labelledby="scheme-label"
        onValueChange={onValueChange}
        value="light"
      />
    </div>,
  );
  const button = document.querySelector('button') as HTMLButtonElement;

  expect(button).toHaveAccessibleName('Change the application color scheme');
  button.focus();
  await userEvent.keyboard(' ');
  expect(onValueChange).toHaveBeenCalledWith('dark');
  expect(document.activeElement).toBe(button);
});

test('inherits button sizing, focus, disabled styling, and icon customization tokens', async () => {
  await render(
    <>
      <button data-testid="before" type="button">
        Before
      </button>
      <TRColorSchemeToggle
        data-testid="small"
        onValueChange={() => {}}
        uiSize="sm"
        value="light"
      />
      <TRColorSchemeToggle
        data-testid="large"
        onValueChange={() => {}}
        style={{ '--tr-icon-button-icon-size': '18px' } as React.CSSProperties}
        uiSize="lg"
        value="dark"
      />
      <TRColorSchemeToggle
        data-testid="disabled"
        disabled
        onValueChange={() => {}}
        value="light"
      />
    </>,
  );
  const before = document.querySelector('[data-testid="before"]') as HTMLButtonElement;
  const small = document.querySelector('[data-testid="small"]') as HTMLButtonElement;
  const large = document.querySelector('[data-testid="large"]') as HTMLButtonElement;
  const disabled = document.querySelector(
    '[data-testid="disabled"]',
  ) as HTMLButtonElement;

  expect(small.getBoundingClientRect().width).toBe(32);
  expect(small.getBoundingClientRect().height).toBe(32);
  expect(large.getBoundingClientRect().width).toBe(48);
  expect(large.getBoundingClientRect().height).toBe(48);
  expect(large.querySelector('svg')?.getBoundingClientRect().width).toBe(18);
  expect(getComputedStyle(disabled).opacity).toBe('0.5');
  before.focus();
  await userEvent.keyboard('{Tab}');
  expect(document.activeElement).toBe(small);
  large.focus();
  await userEvent.keyboard('{Tab}');
  expect(document.activeElement).not.toBe(disabled);
});

test('server-renders and hydrates without consulting system preference or storage', async () => {
  const matchMedia = vi.spyOn(window, 'matchMedia');
  const getItem = vi.spyOn(Storage.prototype, 'getItem');
  const onValueChange = vi.fn();
  const fixture = <TRColorSchemeToggle onValueChange={onValueChange} value="light" />;
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
  expect(matchMedia).not.toHaveBeenCalled();
  expect(getItem).not.toHaveBeenCalled();
  expect(host.querySelector('button')).toHaveAttribute(
    'aria-label',
    'Use dark color scheme',
  );
  await act(async () => root.unmount());
  host.remove();
  matchMedia.mockRestore();
  getItem.mockRestore();
});
