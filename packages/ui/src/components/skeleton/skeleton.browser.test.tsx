import '../../core/core.css';
import './skeleton.css';
import { type CSSProperties, createRef } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRSkeleton } from './index.js';

test('renders decorative and announced skeleton states', async () => {
  const ref = createRef<HTMLDivElement>();
  await render(<TRSkeleton ref={ref} aria-label="Loading profile" shape="circle" />);
  expect(ref.current?.dataset['shape']).toBe('circle');
  expect(ref.current?.getAttribute('aria-busy')).toBe('true');
});

test('omits live-region state without an accessible label', async () => {
  const ref = createRef<HTMLDivElement>();
  await render(<TRSkeleton ref={ref} />);
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
      <TRSkeleton aria-labelledby="loading-label" ref={ref} />
    </div>,
  );
  expect(ref.current?.getAttribute('role')).toBe('status');
  expect(ref.current?.getAttribute('aria-live')).toBe('polite');
  expect(ref.current?.getAttribute('aria-busy')).toBe('true');
  expect(document.querySelectorAll('[role="status"]')).toHaveLength(1);
});

test('removes aria-hidden when announced semantics are requested', async () => {
  const ref = createRef<HTMLDivElement>();
  await render(
    <TRSkeleton
      aria-hidden="true"
      aria-label="Loading records"
      ref={ref}
      role="status"
    />,
  );
  expect(ref.current?.getAttribute('role')).toBe('status');
  expect(ref.current?.hasAttribute('aria-hidden')).toBe(false);
  expect(ref.current?.getAttribute('aria-label')).toBe('Loading records');
});

test('lets explicit dimensions override shape defaults', async () => {
  const circleRef = createRef<HTMLDivElement>();
  const rectangleRef = createRef<HTMLDivElement>();
  await render(
    <>
      <TRSkeleton ref={circleRef} shape="circle" style={{ height: 24, width: 24 }} />
      <TRSkeleton
        ref={rectangleRef}
        shape="rectangle"
        style={{ height: 12, width: 120 }}
      />
    </>,
  );
  expect(getComputedStyle(circleRef.current as HTMLElement).height).toBe('24px');
  expect(getComputedStyle(circleRef.current as HTMLElement).width).toBe('24px');
  expect(getComputedStyle(rectangleRef.current as HTMLElement).height).toBe('12px');
  expect(getComputedStyle(rectangleRef.current as HTMLElement).width).toBe('120px');
});

test('supports the documented component fill customization token', async () => {
  const ref = createRef<HTMLDivElement>();
  await render(
    <TRSkeleton
      ref={ref}
      style={{ '--tr-skeleton-fill': 'rgb(1, 2, 3)' } as CSSProperties}
    />,
  );
  expect(getComputedStyle(ref.current as HTMLElement).backgroundColor).toBe(
    'rgb(1, 2, 3)',
  );
});

test('preserves an explicit non-status role without adding live-region state', async () => {
  const ref = createRef<HTMLDivElement>();
  await render(
    <TRSkeleton aria-label="Decorative placeholder" ref={ref} role="presentation" />,
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
      <TRSkeleton ref={animatedRef} />
      <TRSkeleton animate={false} ref={staticRef} />
    </>,
  );
  expect(animatedRef.current?.dataset['animate']).toBe('true');
  expect(staticRef.current?.dataset['animate']).toBe('false');
  expect(animatedRef.current?.hasAttribute('animate')).toBe(false);
  expect(staticRef.current?.hasAttribute('animate')).toBe(false);
});
