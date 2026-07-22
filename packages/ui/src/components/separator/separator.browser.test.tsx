import '../../core/core.css';
import './separator.css';
import { type CSSProperties, createRef } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRSeparator } from './index.js';

test('renders a semantic separator', async () => {
  const ref = createRef<HTMLDivElement>();
  await render(<TRSeparator ref={ref} orientation="vertical" />);
  expect(ref.current?.getAttribute('aria-orientation')).toBe('vertical');
  expect(ref.current?.getAttribute('role')).toBe('separator');
});

test('keeps horizontal and decorative role semantics', async () => {
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
  expect(presentationRef.current).not.toHaveAttribute('aria-orientation');
});

test('preserves native props, consumer classes, and render composition', async () => {
  const ref = createRef<HTMLDivElement>();
  await render(
    <TRSeparator
      className="consumer-separator"
      data-boundary="content"
      ref={ref}
      render={<section />}
    />,
  );

  expect(ref.current?.tagName).toBe('SECTION');
  expect(ref.current).toHaveClass('tr-separator', 'consumer-separator');
  expect(ref.current?.dataset['boundary']).toBe('content');
});

test('uses token-backed dimensions and supports consumer appearance overrides', async () => {
  const horizontalRef = createRef<HTMLDivElement>();
  const verticalRef = createRef<HTMLDivElement>();
  const customRef = createRef<HTMLDivElement>();
  const customStyle = {
    '--tr-separator-color': 'rgb(1, 2, 3)',
    '--tr-separator-thickness': '3px',
  } as CSSProperties;

  await render(
    <div style={{ height: 64, width: 240 }}>
      <TRSeparator ref={horizontalRef} />
      <div style={{ height: 64 }}>
        <TRSeparator orientation="vertical" ref={verticalRef} />
      </div>
      <TRSeparator ref={customRef} style={customStyle} />
    </div>,
  );

  const horizontalStyle = getComputedStyle(horizontalRef.current as HTMLElement);
  const verticalStyle = getComputedStyle(verticalRef.current as HTMLElement);
  const customComputedStyle = getComputedStyle(customRef.current as HTMLElement);
  expect(horizontalStyle.height).toBe('1px');
  expect(horizontalStyle.width).toBe('240px');
  expect(verticalStyle.height).toBe('64px');
  expect(verticalStyle.width).toBe('1px');
  expect(customComputedStyle.height).toBe('3px');
  expect(customComputedStyle.backgroundColor).toBe('rgb(1, 2, 3)');
});
