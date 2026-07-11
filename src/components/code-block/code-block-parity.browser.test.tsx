import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectElementParity } from '../../../e2e/fixtures/component-browser-harness.js';
import { CodeBlock } from './react.js';

test.each([
  false,
  true,
])('CodeBlock DOM/React plain parity for wrap=%s', async (wrap) => {
  const raw = document.createElement('pre');
  raw.className = 'tr-code-block';
  if (wrap) raw.dataset['wrap'] = 'true';
  raw.innerHTML = '<code>const rack = true;</code>';
  document.body.append(raw);
  const rendered = await render(<CodeBlock code="const rack = true;" wrap={wrap} />);
  const react = rendered.container.querySelector('.tr-code-block')!;
  expectElementParity(raw, react);
  expectElementParity(raw.querySelector('code')!, react.querySelector('code')!);
  raw.remove();
});
