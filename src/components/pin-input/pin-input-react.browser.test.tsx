import '../../core/core.css';
import './pin-input.css';
import { createRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { PinInput, type PinInputRef } from './react.js';

test('React PinInput covers controlled updates, labels, form value and callbacks', async () => {
  const changed = vi.fn();
  const completed = vi.fn();
  function Controlled() {
    const [value, setValue] = useState('12');
    return (
      <PinInput
        getDigitLabel={(index) => `PIN ${index + 1}`}
        length={3}
        name="pin"
        onChange={(next) => {
          changed(next);
          setValue(next);
        }}
        onComplete={completed}
        value={value}
      />
    );
  }
  const screen = await render(<Controlled />);
  expect(screen.getByLabelText('PIN 1').element()).toHaveValue('1');
  expect(screen.container.querySelector('input[type="hidden"]')).toHaveValue('12');
  await screen.getByLabelText('PIN 3').fill('3');
  expect(changed).toHaveBeenLastCalledWith('123');
  expect(completed).toHaveBeenLastCalledWith('123');
});

test('React PinInput covers defaults, autofocus, disabled state and ref methods', async () => {
  const ref = createRef<PinInputRef>();
  const screen = await render(
    <PinInput autoFocus defaultValue="a1234567" invalid length={4} ref={ref} />,
  );
  await expect
    .poll(() => document.activeElement)
    .toBe(screen.getByLabelText('Digit 1 of 4').element());
  ref.current?.focus();
  ref.current?.clear();
  await expect
    .poll(() => screen.container.querySelectorAll('input[value=""]').length)
    .toBe(4);
  const disabled = await render(<PinInput autoFocus disabled length={2} />);
  expect(disabled.container.querySelector('.tr-pin-input')).toHaveAttribute(
    'aria-disabled',
    'true',
  );
});
