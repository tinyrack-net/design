import './number-field.css';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { NumberField, NumberFieldRoot } from './index.js';

test('renders the Tinyrack NumberField wrapper', async () => {
  expect(NumberField.Root).toBe(NumberFieldRoot);
  await render(
    <NumberField.Root defaultValue={2}>
      <NumberField.Group>
        <NumberField.Decrement>-</NumberField.Decrement>
        <NumberField.Input aria-label="Count" />
        <NumberField.Increment>+</NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>,
  );
  expect(document.querySelector('.tr-number-field')).not.toBeNull();
});

test('steps with pointer and keyboard, clamps bounds, and submits its value', async () => {
  const onValueChange = vi.fn();
  await render(
    <form>
      <NumberField.Root
        defaultValue={2}
        max={3}
        min={0}
        name="replicas"
        onValueChange={onValueChange}
      >
        <NumberField.Group>
          <NumberField.Decrement aria-label="Decrease">-</NumberField.Decrement>
          <NumberField.Input aria-label="Replicas" />
          <NumberField.Increment aria-label="Increase">+</NumberField.Increment>
        </NumberField.Group>
      </NumberField.Root>
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
