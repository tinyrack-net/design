import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  createRawElement,
  expectElementParity,
} from '../../../e2e/fixtures/component-browser-harness.js';
import { Code } from './react.js';

test('Code DOM/React parity', async () => {
  const raw = createRawElement('code', { className: 'tr-code', text: 'pnpm verify' });
  const rendered = await render(<Code>pnpm verify</Code>);
  expectElementParity(raw, rendered.container.querySelector('.tr-code')!);
  raw.remove();
});
