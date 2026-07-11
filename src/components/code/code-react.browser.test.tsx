import '../../core/core.css';
import './code.css';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Code } from './react.js';

test('React Code forwards native props, class and ref', async () => {
  const ref = createRef<HTMLElement>();
  const screen = await render(
    <Code className="consumer" data-language="shell" ref={ref}>
      pnpm verify
    </Code>,
  );
  expect(screen.getByText('pnpm verify').element()).toHaveClass('tr-code', 'consumer');
  expect(ref.current).toBe(screen.getByText('pnpm verify').element());
});
