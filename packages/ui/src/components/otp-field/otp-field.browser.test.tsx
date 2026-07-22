import '../../core/core.css';
import './otp-field.css';
import { act, createRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  TROTPField,
  TROTPFieldInput,
  TROTPFieldRoot,
  TROTPFieldSeparator,
} from './index.js';

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
    <TROTPField.Root
      aria-label="Verification code"
      disabled={disabled}
      length={4}
      name="code"
      onValueChange={onValueChange}
      onValueComplete={onValueComplete}
      readOnly={readOnly}
    >
      <TROTPField.Input />
      <TROTPField.Input />
      <TROTPField.Input />
      <TROTPField.Input />
    </TROTPField.Root>
  );
}

test('preserves namespace, refs, native attributes, and slot semantics', async () => {
  expect(TROTPField.Root).toBe(TROTPFieldRoot);
  expect(TROTPField.Input).toBe(TROTPFieldInput);
  expect(TROTPField.Separator).toBe(TROTPFieldSeparator);
  const rootRef = createRef<HTMLDivElement>();
  const inputRef = createRef<HTMLInputElement>();
  await render(
    <TROTPField.Root
      aria-describedby="code-help"
      aria-label="Verification code"
      className="consumer-otp"
      length={2}
      ref={rootRef}
    >
      <TROTPField.Input inputMode="numeric" ref={inputRef} />
      <TROTPField.Separator aria-hidden="true" />
      <TROTPField.Input />
    </TROTPField.Root>,
  );

  expect(rootRef.current).toHaveClass('tr-otp-field', 'consumer-otp');
  expect(rootRef.current?.getAttribute('aria-label')).toBe('Verification code');
  expect(rootRef.current?.getAttribute('aria-describedby')).toBe('code-help');
  expect(inputRef.current).toHaveClass('tr-otp-field-digit');
  expect(inputRef.current?.inputMode).toBe('numeric');
  expect(inputRef.current?.getAttribute('autocomplete')).toBe('one-time-code');
  expect(inputRef.current?.pattern).toBe('\\d{1}');
  expect(rootRef.current?.getAttribute('role')).toBe('group');
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
        <TROTPField.Root
          aria-label="Controlled code"
          length={4}
          onValueChange={setValue}
          value={value}
        >
          <TROTPField.Input />
          <TROTPField.Input />
          <TROTPField.Input />
          <TROTPField.Input />
        </TROTPField.Root>
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

test('supports paste, navigation, deletion, and invalid input events', async () => {
  const onValueChange = vi.fn();
  const onValueComplete = vi.fn();
  const onValueInvalid = vi.fn();
  await render(
    <TROTPField.Root
      aria-label="Recovery code"
      length={4}
      onValueChange={onValueChange}
      onValueComplete={onValueComplete}
      onValueInvalid={onValueInvalid}
    >
      <TROTPField.Input />
      <TROTPField.Input />
      <TROTPField.Input />
      <TROTPField.Input />
    </TROTPField.Root>,
  );
  const slots = Array.from(
    document.querySelectorAll<HTMLInputElement>('.tr-otp-field-digit'),
  );

  slots[0]?.focus();
  const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(pasteEvent, 'clipboardData', {
    value: { getData: () => '12x34' },
  });
  slots[0]?.dispatchEvent(pasteEvent);
  await expect.poll(() => slots.map((slot) => slot.value).join('')).toBe('1234');
  expect(onValueInvalid).toHaveBeenCalledWith('12x34', expect.anything());
  expect(onValueChange.mock.calls.at(-1)?.[0]).toBe('1234');
  expect(onValueComplete).toHaveBeenCalledWith('1234', expect.anything());
  expect(document.activeElement).toBe(slots[3]);

  await userEvent.keyboard('{ArrowLeft}{Delete}');
  await expect.poll(() => slots.map((slot) => slot.value).join('')).toBe('124');
  expect(document.activeElement).toBe(slots[2]);
  await userEvent.keyboard('{Backspace}');
  await expect.poll(() => slots.map((slot) => slot.value).join('')).toBe('12');
  expect(document.activeElement).toBe(slots[1]);
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

test('exposes required validity, validation state, and external form association', async () => {
  await render(
    <>
      <form id="verification-form" />
      <TROTPField.Root
        aria-label="Verification code"
        form="verification-form"
        length={4}
        name="code"
        required
      >
        <TROTPField.Input />
        <TROTPField.Input />
        <TROTPField.Input />
        <TROTPField.Input />
      </TROTPField.Root>
    </>,
  );
  const slots = Array.from(
    document.querySelectorAll<HTMLInputElement>('.tr-otp-field-digit'),
  );
  const form = document.querySelector<HTMLFormElement>('#verification-form');

  expect(form?.checkValidity()).toBe(false);
  expect(slots.every((slot) => slot.required)).toBe(true);
  slots[0]?.focus();
  await userEvent.keyboard('4821');
  expect(form?.checkValidity()).toBe(true);
  expect(new FormData(form as HTMLFormElement).get('code')).toBe('4821');
});

test('16 uses a vertical OTP separator without collapsing digit slots', async () => {
  await render(
    <TROTPField.Root aria-label="Recovery code" length={4}>
      <TROTPField.Input />
      <TROTPField.Input />
      <TROTPField.Separator aria-hidden="true" />
      <TROTPField.Input />
      <TROTPField.Input />
    </TROTPField.Root>,
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

test('supports OTP appearance customization tokens', async () => {
  await render(
    <TROTPField.Root aria-label="Tokenized code" length={2}>
      <TROTPField.Input />
      <TROTPField.Input />
    </TROTPField.Root>,
  );
  const root = document.querySelector<HTMLElement>('.tr-otp-field');
  const slot = document.querySelector<HTMLInputElement>('.tr-otp-field-digit');
  root?.style.setProperty('--tr-otp-field-background', 'rgb(1, 2, 3)');
  root?.style.setProperty('--tr-otp-field-color', 'rgb(250, 251, 252)');
  root?.style.setProperty('--tr-otp-field-radius', '3px');
  root?.style.setProperty('--tr-otp-field-border-color', 'rgb(4, 5, 6)');

  expect(getComputedStyle(slot as HTMLInputElement).backgroundColor).toBe(
    'rgb(1, 2, 3)',
  );
  expect(getComputedStyle(slot as HTMLInputElement).color).toBe('rgb(250, 251, 252)');
  expect(getComputedStyle(slot as HTMLInputElement).borderRadius).toBe('3px');
  expect(getComputedStyle(slot as HTMLInputElement).borderColor).toBe('rgb(4, 5, 6)');
});

test('server renders and hydrates a populated field without recovery', async () => {
  const fixture = (
    <TROTPField.Root aria-label="Verification code" defaultValue="42" length={4}>
      <TROTPField.Input />
      <TROTPField.Input />
      <TROTPField.Separator aria-hidden="true" />
      <TROTPField.Input />
      <TROTPField.Input />
    </TROTPField.Root>
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
  expect(
    Array.from(host.querySelectorAll<HTMLInputElement>('.tr-otp-field-digit'))
      .map((slot) => slot.value)
      .join(''),
  ).toBe('42');

  await act(async () => root.unmount());
  host.remove();
});

test('forwards uiSize to the root and rescales segment height', async () => {
  const rootRef = createRef<HTMLDivElement>();
  await render(
    <TROTPField.Root length={2} ref={rootRef} uiSize="sm">
      <TROTPField.Input />
      <TROTPField.Input />
    </TROTPField.Root>,
  );

  expect(rootRef.current?.getAttribute('data-ui-size')).toBe('sm');
  const segments = document.querySelectorAll<HTMLInputElement>('.tr-otp-field-digit');
  expect(segments[0]?.getBoundingClientRect().height).toBe(32);
});
