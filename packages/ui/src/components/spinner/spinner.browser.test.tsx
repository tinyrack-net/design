import '../../core/core.css';
import './spinner.css';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRSpinner } from './index.js';

test('renders an announced loading indicator', async () => {
  const ref = createRef<HTMLSpanElement>();
  await render(<TRSpinner ref={ref} label="Saving" uiSize="lg" variant="primary" />);
  expect(ref.current?.getAttribute('role')).toBe('status');
  expect(ref.current?.getAttribute('aria-label')).toBe('Saving');
  expect(ref.current?.dataset['uiSize']).toBe('lg');
});

test('styles the public muted variant independently from current color', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <div style={{ color: 'rgb(255, 0, 255)' }}>
      <TRSpinner data-testid="current" variant="current" />
      <TRSpinner data-testid="muted" variant="muted" />
    </div>,
  );
  const current = document.querySelector<HTMLElement>('[data-testid="current"]');
  const muted = document.querySelector<HTMLElement>('[data-testid="muted"]');
  expect(getComputedStyle(muted as HTMLElement).borderTopColor).not.toBe(
    getComputedStyle(current as HTMLElement).borderTopColor,
  );
});

test('supports a decorative mode for loading indicators inside named controls', async () => {
  const ref = createRef<HTMLSpanElement>();
  await render(<TRSpinner decorative label="Ignored label" ref={ref} />);
  expect(ref.current?.getAttribute('aria-hidden')).toBe('true');
  expect(ref.current?.hasAttribute('aria-label')).toBe(false);
  expect(ref.current?.hasAttribute('role')).toBe(false);
});
