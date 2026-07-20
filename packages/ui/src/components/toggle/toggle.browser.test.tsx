import './toggle.css';
import { createRef, type FormEvent, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRToggle } from './index.js';

test('renders the Tinyrack TRToggle wrapper', async () => {
  expect(typeof TRToggle).toBe('function');
  await render(
    <TRToggle aria-label="Bold" defaultPressed>
      Bold
    </TRToggle>,
  );
  expect(document.querySelector('.tr-toggle')).not.toBeNull();
});

test('preserves controlled pressed state and native button props', async () => {
  function ControlledToggle() {
    const [pressed, setPressed] = useState(false);

    return (
      <>
        <TRToggle
          data-testid="toggle"
          onPressedChange={setPressed}
          pressed={pressed}
          type="button"
        >
          Bold
        </TRToggle>
        <output>{pressed ? 'on' : 'off'}</output>
      </>
    );
  }

  await render(<ControlledToggle />);
  const toggle = document.querySelector<HTMLButtonElement>('[data-testid="toggle"]');
  expect(toggle?.type).toBe('button');
  expect(toggle?.getAttribute('aria-pressed')).toBe('false');
  toggle?.click();
  await expect.poll(() => document.querySelector('output')?.textContent).toBe('on');
  expect(toggle?.getAttribute('aria-pressed')).toBe('true');
});

test('preserves native button keyboard behavior without submitting its form', async () => {
  const onPressedChange = vi.fn();
  const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault());
  const ref = createRef<HTMLButtonElement>();

  await render(
    <form onSubmit={onSubmit}>
      <TRToggle data-consumer="format" onPressedChange={onPressedChange} ref={ref}>
        Bold
      </TRToggle>
      <TRToggle disabled onPressedChange={onPressedChange}>
        Disabled
      </TRToggle>
    </form>,
  );

  const toggle = page.getByRole('button', { name: 'Bold' });
  expect(ref.current).toBe(toggle.element());
  expect(ref.current?.type).toBe('button');
  expect(ref.current?.dataset['consumer']).toBe('format');

  toggle.element().focus();
  await userEvent.keyboard(' ');
  await expect.poll(() => toggle.element().getAttribute('aria-pressed')).toBe('true');
  await userEvent.keyboard('{Enter}');
  await expect.poll(() => toggle.element().getAttribute('aria-pressed')).toBe('false');
  expect(onSubmit).not.toHaveBeenCalled();
  expect(onPressedChange.mock.calls.map(([value]) => value)).toEqual([true, false]);

  const disabled = page.getByRole('button', { name: 'Disabled' });
  await disabled.click({ force: true });
  expect(disabled.element().getAttribute('aria-pressed')).toBe('false');
  expect(onPressedChange).toHaveBeenCalledTimes(2);
});
