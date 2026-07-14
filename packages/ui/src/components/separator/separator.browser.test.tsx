import './separator.css';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Separator } from './index.js';

test('renders a semantic separator', async () => {
  const ref = createRef<HTMLHRElement>();
  await render(<Separator ref={ref} orientation="vertical" />);
  expect(ref.current?.getAttribute('aria-orientation')).toBe('vertical');
  expect(ref.current?.getAttribute('role')).toBe('separator');
});

test('keeps horizontal and custom role semantics', async () => {
  const horizontalRef = createRef<HTMLHRElement>();
  const presentationRef = createRef<HTMLHRElement>();
  await render(
    <>
      <Separator ref={horizontalRef} />
      <Separator ref={presentationRef} orientation="horizontal" role="presentation" />
    </>,
  );
  expect(horizontalRef.current?.hasAttribute('aria-orientation')).toBe(false);
  expect(presentationRef.current?.getAttribute('role')).toBe('presentation');
  expect(presentationRef.current?.hasAttribute('aria-orientation')).toBe(false);
});

test('only exposes orientation when the resolved role is separator', async () => {
  const ref = createRef<HTMLHRElement>();
  await render(<Separator orientation="horizontal" ref={ref} role="separator" />);
  expect(ref.current?.getAttribute('aria-orientation')).toBe('horizontal');
});
