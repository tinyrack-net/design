import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  createRawElement,
  expectElementParity,
} from '../../../e2e/fixtures/component-browser-harness.js';
import { alertVariants } from './contract.js';
import { Alert } from './react.js';

test.each(alertVariants)('Alert DOM/React parity for %s', async (variant) => {
  const raw = createRawElement('div', {
    className: 'tr-alert',
    data: { variant },
    text: 'Status',
  });
  const rendered = await render(<Alert variant={variant}>Status</Alert>);
  expectElementParity(raw, rendered.container.querySelector('.tr-alert')!);
  raw.remove();
});
