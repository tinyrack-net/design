import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  createRawElement,
  expectElementParity,
} from '../../../e2e/fixtures/component-browser-harness.js';
import { buttonAppearances, buttonSizes, buttonVariants } from './contract.js';
import { Button } from './react.js';

const buttonCases = buttonSizes.flatMap((size) =>
  buttonVariants.flatMap((variant) =>
    buttonAppearances.map((appearance) => [size, variant, appearance] as const),
  ),
);

test.each(
  buttonCases,
)('Button DOM/React parity for %s/%s/%s', async (size, variant, appearance) => {
  const raw = createRawElement('button', {
    attributes: { type: 'button' },
    className: 'tr-btn',
    data: { appearance, size, variant },
    text: 'Save',
  });
  const rendered = await render(
    <Button appearance={appearance} size={size} variant={variant}>
      Save
    </Button>,
  );
  expectElementParity(raw, rendered.container.querySelector('.tr-btn')!);
  raw.remove();
});
