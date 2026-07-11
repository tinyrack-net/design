import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectElementParity } from '../../../e2e/fixtures/component-browser-harness.js';
import { PinInput } from './react.js';

test.each([2, 4, 6])('PinInput DOM/React parity for length %s', async (length) => {
  const raw = document.createElement('fieldset');
  raw.className = 'tr-pin-input';
  raw.dataset['length'] = String(length);
  raw.dataset['trPinInput'] = 'true';
  raw.innerHTML = Array.from(
    { length },
    (_, index) =>
      `<input aria-label="Digit ${index + 1} of ${length}" autocomplete="${index === 0 ? 'one-time-code' : 'off'}" class="tr-pin-input-digit" data-index="${index}" data-tr-pin-input-digit="true" inputmode="numeric" maxlength="1" pattern="[0-9]*" type="text">`,
  ).join('');
  document.body.append(raw);
  const rendered = await render(<PinInput length={length} />);
  const react = rendered.container.querySelector('.tr-pin-input')!;
  expectElementParity(raw, react);
  const rawDigits = raw.querySelectorAll('input');
  const reactDigits = react.querySelectorAll('input');
  for (const [index, digit] of Array.from(rawDigits).entries()) {
    expectElementParity(digit, reactDigits[index]!, { ignoreAttributes: ['value'] });
  }
  raw.remove();
});
