import './separator.css';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRSeparator } from './index.js';

test('renders a semantic separator', async () => {
  const ref = createRef<HTMLDivElement>();
  await render(<TRSeparator ref={ref} orientation="vertical" />);
  expect(ref.current?.getAttribute('aria-orientation')).toBe('vertical');
  expect(ref.current?.getAttribute('role')).toBe('separator');
});

test('keeps horizontal and custom role semantics', async () => {
  const horizontalRef = createRef<HTMLDivElement>();
  const presentationRef = createRef<HTMLDivElement>();
  await render(
    <>
      <TRSeparator ref={horizontalRef} />
      <TRSeparator ref={presentationRef} orientation="horizontal" role="presentation" />
    </>,
  );
  expect(horizontalRef.current?.getAttribute('aria-orientation')).toBe('horizontal');
  expect(presentationRef.current?.getAttribute('role')).toBe('presentation');
  expect(presentationRef.current?.getAttribute('aria-orientation')).toBe('horizontal');
});

test('only exposes orientation when the resolved role is separator', async () => {
  const ref = createRef<HTMLDivElement>();
  await render(<TRSeparator orientation="horizontal" ref={ref} role="separator" />);
  expect(ref.current?.getAttribute('aria-orientation')).toBe('horizontal');
});
