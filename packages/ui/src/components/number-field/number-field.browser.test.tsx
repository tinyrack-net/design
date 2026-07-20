import './number-field.css';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRNumberField, TRNumberFieldRoot } from './index.js';

test('renders the Tinyrack TRNumberField wrapper', async () => {
  expect(TRNumberField.Root).toBe(TRNumberFieldRoot);
  await render(
    <TRNumberField.Root defaultValue={2}>
      <TRNumberField.Group>
        <TRNumberField.Decrement>-</TRNumberField.Decrement>
        <TRNumberField.Input aria-label="Count" />
        <TRNumberField.Increment>+</TRNumberField.Increment>
      </TRNumberField.Group>
    </TRNumberField.Root>,
  );
  expect(document.querySelector('.tr-number-field')).not.toBeNull();
});

test('steps with pointer and keyboard, clamps bounds, and submits its value', async () => {
  const onValueChange = vi.fn();
  await render(
    <form>
      <TRNumberField.Root
        defaultValue={2}
        max={3}
        min={0}
        name="replicas"
        onValueChange={onValueChange}
      >
        <TRNumberField.Group>
          <TRNumberField.Decrement aria-label="Decrease">-</TRNumberField.Decrement>
          <TRNumberField.Input aria-label="Replicas" />
          <TRNumberField.Increment aria-label="Increase">+</TRNumberField.Increment>
        </TRNumberField.Group>
      </TRNumberField.Root>
    </form>,
  );

  const input = document.querySelector<HTMLInputElement>('.tr-number-field-input');
  const increment = document.querySelector<HTMLButtonElement>(
    '.tr-number-field-increment',
  );
  increment?.click();
  increment?.click();
  await expect.poll(() => input?.value).toBe('3');
  expect(onValueChange.mock.calls.at(-1)?.[0]).toBe(3);

  input?.focus();
  await userEvent.keyboard('{ArrowDown}');
  await expect.poll(() => input?.value).toBe('2');
  expect(
    new FormData(document.querySelector('form') as HTMLFormElement).get('replicas'),
  ).toBe('2');
});
