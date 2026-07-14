import '../../core/core.css';
import './skeleton.css';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Skeleton } from './index.js';

test('renders decorative and announced skeleton states', async () => {
  const ref = createRef<HTMLDivElement>();
  await render(<Skeleton ref={ref} aria-label="Loading profile" shape="circle" />);
  expect(ref.current?.dataset['shape']).toBe('circle');
  expect(ref.current?.getAttribute('aria-busy')).toBe('true');
});

test('omits live-region state without an accessible label', async () => {
  const ref = createRef<HTMLDivElement>();
  await render(<Skeleton ref={ref} />);
  expect(ref.current?.hasAttribute('aria-label')).toBe(false);
  expect(ref.current?.hasAttribute('aria-live')).toBe(false);
  expect(ref.current?.hasAttribute('aria-busy')).toBe(false);
  expect(ref.current?.getAttribute('aria-hidden')).toBe('true');
  expect(ref.current?.hasAttribute('role')).toBe(false);
});

test('uses aria-labelledby and explicit status semantics for one announced region', async () => {
  const ref = createRef<HTMLDivElement>();
  await render(
    <div>
      <span id="loading-label">Loading dashboard</span>
      <Skeleton aria-labelledby="loading-label" ref={ref} />
    </div>,
  );
  expect(ref.current?.getAttribute('role')).toBe('status');
  expect(ref.current?.getAttribute('aria-live')).toBe('polite');
  expect(ref.current?.getAttribute('aria-busy')).toBe('true');
  expect(document.querySelectorAll('[role="status"]')).toHaveLength(1);
});

test('preserves an explicit non-status role without adding live-region state', async () => {
  const ref = createRef<HTMLDivElement>();
  await render(
    <Skeleton aria-label="Decorative placeholder" ref={ref} role="presentation" />,
  );
  expect(ref.current?.getAttribute('role')).toBe('presentation');
  expect(ref.current?.hasAttribute('aria-label')).toBe(false);
  expect(ref.current?.hasAttribute('aria-live')).toBe(false);
});

test('animates by default and supports a static opt-out', async () => {
  const animatedRef = createRef<HTMLDivElement>();
  const staticRef = createRef<HTMLDivElement>();
  await render(
    <>
      <Skeleton ref={animatedRef} />
      <Skeleton animate={false} ref={staticRef} />
    </>,
  );
  expect(animatedRef.current?.dataset['animate']).toBe('true');
  expect(staticRef.current?.dataset['animate']).toBe('false');
  expect(animatedRef.current?.hasAttribute('animate')).toBe(false);
  expect(staticRef.current?.hasAttribute('animate')).toBe(false);
});
