import './code.css';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Code } from './index.js';

test('renders semantic inline code', async () => {
  const ref = createRef<HTMLElement>();
  await render(<Code ref={ref}>pnpm verify</Code>);
  expect(ref.current?.tagName).toBe('CODE');
  expect(ref.current?.classList.contains('tr-code')).toBe(true);
});

test('inherits surrounding font size and preserves multiline fragments', async () => {
  await render(
    <p style={{ fontSize: '20px', width: '12rem' }}>
      Run <Code data-testid="multiline">{'pnpm test\npnpm verify'}</Code> before
      release.
    </p>,
  );
  const code = document.querySelector<HTMLElement>('[data-testid="multiline"]');
  expect(getComputedStyle(code as HTMLElement).fontSize).toBe('20px');
  expect(getComputedStyle(code as HTMLElement).whiteSpace).toBe('break-spaces');
  expect(code?.textContent).toBe('pnpm test\npnpm verify');
});
