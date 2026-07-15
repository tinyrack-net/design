import '../../core/core.css';
import './otp-field.css';
import { createRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { OTPField, OTPFieldRoot } from './index.js';

function FourDigitField({
  disabled,
  onValueChange,
  onValueComplete,
  readOnly,
}: {
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  onValueComplete?: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <OTPField.Root
      aria-label="Verification code"
      disabled={disabled}
      length={4}
      name="code"
      onValueChange={onValueChange}
      onValueComplete={onValueComplete}
      readOnly={readOnly}
    >
      <OTPField.Input />
      <OTPField.Input />
      <OTPField.Input />
      <OTPField.Input />
    </OTPField.Root>
  );
}

test('preserves namespace, refs, native attributes, and slot semantics', async () => {
  expect(OTPField.Root).toBe(OTPFieldRoot);
  const rootRef = createRef<HTMLDivElement>();
  const inputRef = createRef<HTMLInputElement>();
  await render(
    <OTPField.Root
      aria-describedby="code-help"
      aria-label="Verification code"
      className="consumer-otp"
      length={2}
      ref={rootRef}
    >
      <OTPField.Input inputMode="numeric" ref={inputRef} />
      <OTPField.Separator aria-hidden="true" />
      <OTPField.Input />
    </OTPField.Root>,
  );

  expect(rootRef.current).toHaveClass('tr-otp-field', 'consumer-otp');
  expect(rootRef.current?.getAttribute('aria-label')).toBe('Verification code');
  expect(rootRef.current?.getAttribute('aria-describedby')).toBe('code-help');
  expect(inputRef.current).toHaveClass('tr-otp-field-digit');
  expect(inputRef.current?.inputMode).toBe('numeric');
  expect(document.querySelector('.tr-separator')).not.toBeNull();
});

test('accepts keyboard input, advances slots, completes, and submits one form value', async () => {
  const onValueChange = vi.fn();
  const onValueComplete = vi.fn();
  await render(
    <form data-testid="otp-form">
      <FourDigitField onValueChange={onValueChange} onValueComplete={onValueComplete} />
    </form>,
  );
  const slots = Array.from(
    document.querySelectorAll<HTMLInputElement>('.tr-otp-field-digit'),
  );
  slots[0]?.focus();
  await userEvent.keyboard('1234');

  await expect.poll(() => slots.map((slot) => slot.value).join('')).toBe('1234');
  expect(onValueChange.mock.calls.at(-1)?.[0]).toBe('1234');
  expect(onValueComplete).toHaveBeenCalledWith('1234', expect.anything());
  const form = document.querySelector<HTMLFormElement>('[data-testid="otp-form"]');
  expect(new FormData(form as HTMLFormElement).get('code')).toBe('1234');
  expect(document.querySelectorAll('input[name="code"]')).toHaveLength(1);
});

test('keeps a controlled value aligned with keyboard edits', async () => {
  function ControlledOTP() {
    const [value, setValue] = useState('12');
    return (
      <>
        <OTPField.Root
          aria-label="Controlled code"
          length={4}
          onValueChange={setValue}
          value={value}
        >
          <OTPField.Input />
          <OTPField.Input />
          <OTPField.Input />
          <OTPField.Input />
        </OTPField.Root>
        <output>{value}</output>
      </>
    );
  }

  await render(<ControlledOTP />);
  const slots = Array.from(
    document.querySelectorAll<HTMLInputElement>('.tr-otp-field-digit'),
  );
  slots[2]?.focus();
  await userEvent.keyboard('34');
  await expect.poll(() => document.querySelector('output')?.textContent).toBe('1234');
  expect(slots.map((slot) => slot.value).join('')).toBe('1234');
});

test('blocks edits in disabled and read-only states', async () => {
  const onDisabledChange = vi.fn();
  const onReadOnlyChange = vi.fn();
  await render(
    <>
      <FourDigitField disabled onValueChange={onDisabledChange} />
      <FourDigitField onValueChange={onReadOnlyChange} readOnly />
    </>,
  );
  const slots = Array.from(
    document.querySelectorAll<HTMLInputElement>('.tr-otp-field-digit'),
  );
  expect(slots.slice(0, 4).every((slot) => slot.disabled)).toBe(true);
  expect(slots.slice(4).every((slot) => slot.readOnly)).toBe(true);
  slots[4]?.focus();
  await userEvent.keyboard('1');
  expect(onDisabledChange).not.toHaveBeenCalled();
  expect(onReadOnlyChange).not.toHaveBeenCalled();
});

test('16 uses a vertical OTP separator without collapsing digit slots', async () => {
  await render(
    <OTPField.Root aria-label="Recovery code" length={4}>
      <OTPField.Input />
      <OTPField.Input />
      <OTPField.Separator aria-hidden="true" />
      <OTPField.Input />
      <OTPField.Input />
    </OTPField.Root>,
  );

  const separator = document.querySelector<HTMLElement>('.tr-otp-field-separator');
  const slots = Array.from(
    document.querySelectorAll<HTMLInputElement>('.tr-otp-field-digit'),
  );
  expect(separator?.dataset['orientation']).toBe('vertical');
  expect(separator?.getBoundingClientRect().height ?? 0).toBeGreaterThan(20);
  expect(slots).toHaveLength(4);
  expect(slots.every((slot) => slot.getBoundingClientRect().width >= 32)).toBe(true);

  slots[0]?.focus();
  await userEvent.keyboard('4821');
  expect(slots.map((slot) => slot.value).join('')).toBe('4821');
});
