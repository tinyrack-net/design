import '../../core/core.css';
import './color-scheme-toggle.css';
import { createRef, useState } from 'react';
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
